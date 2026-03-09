import { categories } from './categories';
import { tags } from './tags';

export type CombinationRoute = {
  category?: string;
  tag?: string;
  path: string;
  label: string;
};

const buildCategoryRoute = (category: string): CombinationRoute => ({
  path: `/cam/${category}`,
  label: `${category} live`
});

const buildTagRoute = (tag: string): CombinationRoute => ({
  path: `/tag/${tag}`,
  label: `${tag} trend`
});

const buildCategoryTagRoute = (category: string, tag: string): CombinationRoute => ({
  path: `/cam/${category}/${tag}`,
  category,
  tag,
  label: `${category} + ${tag}`
});

export const generateCombinationRoutes = (): CombinationRoute[] => {
  const routes: CombinationRoute[] = [];

  categories.forEach((category) => routes.push(buildCategoryRoute(category)));
  tags.forEach((tag) => routes.push(buildTagRoute(tag)));

  categories.forEach((category) =>
    tags.forEach((tag) => routes.push(buildCategoryTagRoute(category, tag)))
  );

  return routes;
};
