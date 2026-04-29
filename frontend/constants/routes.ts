export const ROUTES = {
  VITAMIN_DASHBOARD: "/vitamin-dashboard",
  RECENT_FOODS: `/recent-foods`,
  VITAMIN_INFO: `/vitamin-information`,
  vitaminDetails: (id: string) => `${ROUTES.VITAMIN_INFO}?vitamin=${id}`,
};
