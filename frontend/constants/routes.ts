export const ROUTES = {
  DASHBOARD: `/dashboard`,
  VITAMIN_BREAKDOWN: "/vitamin-breakdown",
  RECENT_FOODS: `/recent-foods`,
  VITAMIN_INFO: `/vitamin-information`,
  vitaminDetails: (id: string) => `${ROUTES.VITAMIN_INFO}?vitamin=${id}`,
};
