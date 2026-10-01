-- Apply before deploying the updated onboarding API.
ALTER TABLE public.users
    ADD COLUMN nutrition_status text CHECK (nutrition_status IN ('standard', 'pregnancy', 'lactation')),
    ADD COLUMN nutrient_goal_rule_version text,
    ADD COLUMN nutrient_goals_generated_at timestamptz,
    ADD COLUMN nutrient_goal_context jsonb;

-- Do not alter units on existing nutrients: intake rows already use those units.
INSERT INTO public.nutrients (name, symbol, unit) VALUES
    ('Vitamin D (D2 + D3)', 'D', 'ug'),
    ('Vitamin B9 (Folate DFE)', 'B9', 'ug'),
    ('Vitamin B12', 'B12', 'ug'),
    ('Vitamin B6', 'B6', 'mg'),
    ('Vitamin E (alpha-tocopherol)', 'E', 'mg'),
    ('Omega-3 (ALA)', 'ALA', 'g')
ON CONFLICT (symbol) DO NOTHING;

CREATE OR REPLACE FUNCTION public.complete_onboarding_with_goals(
    p_user_id uuid, p_goals jsonb, p_rule_version text, p_context jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    profile public.users%ROWTYPE;
BEGIN
    -- Serialize retries and prevent partial completion when any write fails.
    SELECT * INTO STRICT profile FROM public.users WHERE id = p_user_id FOR UPDATE;
    IF profile.is_completed AND profile.nutrient_goal_rule_version IS NOT NULL THEN
        RETURN;
    END IF;
    IF profile.date_of_birth::text IS DISTINCT FROM p_context->>'date_of_birth'
       OR profile.sex::text IS DISTINCT FROM p_context->>'sex'
       OR profile.nutrition_status IS DISTINCT FROM p_context->>'nutrition_status' THEN
        RAISE EXCEPTION 'Profile changed during calculation; retry completion';
    END IF;
    IF p_goals IS NULL OR jsonb_typeof(p_goals) <> 'array' THEN
        RAISE EXCEPTION 'Goals must be an array';
    END IF;
    IF jsonb_array_length(p_goals) = 0 OR EXISTS (
        SELECT 1 FROM jsonb_to_recordset(p_goals) AS g(nutrient_id integer, quantity numeric)
        WHERE g.nutrient_id IS NULL OR g.quantity IS NULL OR g.quantity <= 0
    ) THEN
        RAISE EXCEPTION 'Positive nutrient goals are required';
    END IF;

    INSERT INTO public.nutrient_goals (user_id, nutrient_id, quantity)
    SELECT p_user_id, g.nutrient_id, g.quantity
    FROM jsonb_to_recordset(p_goals) AS g(nutrient_id integer, quantity numeric)
    ON CONFLICT (user_id, nutrient_id) DO UPDATE SET quantity = EXCLUDED.quantity;

    UPDATE public.users SET
        is_completed = true,
        current_step = 'complete',
        onboarding_completed_at = COALESCE(onboarding_completed_at, now()),
        nutrient_goals_generated_at = now(),
        nutrient_goal_rule_version = p_rule_version,
        nutrient_goal_context = p_context
    WHERE id = p_user_id;
END;
$$;

-- Only the authenticated backend's admin client may supply calculated targets.
REVOKE ALL ON FUNCTION public.complete_onboarding_with_goals(uuid, jsonb, text, jsonb)
    FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_onboarding_with_goals(uuid, jsonb, text, jsonb)
    TO service_role;
