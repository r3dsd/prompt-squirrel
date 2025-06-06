import { ALL_CATEGORY_ID, NONE_CATEGORY, NONE_CATEGORY_ID } from '@/components/category/constants';
import { useCategoryStore } from '@/store';

export function isStaticCategory(category: Category | null): boolean;
export function isStaticCategory(categoryId: number | null): boolean;
export function isStaticCategory(category: Category | null | number): boolean {
    if (!category) return false;

    if (typeof category === 'number') {
        return category === ALL_CATEGORY_ID || category === NONE_CATEGORY_ID;
    }

    return category.id === ALL_CATEGORY_ID || category.id === NONE_CATEGORY_ID;
}

export function staticCategoryToNull(category: Category): Category | null {
    if (category.id === ALL_CATEGORY_ID || category.id === NONE_CATEGORY_ID) {
        return null;
    }

    return category;
}

export function CategoryIdToCategory(categoryId: number | null): Category {
    if (categoryId === null) return NONE_CATEGORY;
    const category = useCategoryStore.getState().categories.find((c) => c.id === categoryId);
    if (!category) return NONE_CATEGORY;
    return category;
}
