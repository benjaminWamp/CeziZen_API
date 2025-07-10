import {
  Role as RoleModel,
  User as UserModel,
  Article as ArticleModel,
  Category as CategoryModel,
  Exercise as ExerciseModel,
  ExerciseSession as ExerciseSessionModel,
} from '@prisma/client';

export interface UserType
  extends Omit<
    UserModel,
    'password' | 'roleId' | 'createdAt' | 'updatedAt' | 'clerkId'
  > {
  role: Omit<RoleModel, 'createdAt' | 'updatedAt'>;
}

export interface ArticleType
  extends Omit<
    ArticleModel,
    'category' | 'categoryId' | 'createdAt' | 'updatedAt' | 'userId'
  > {
  user: Pick<UserType, 'id' | 'firstname' | 'lastname'> | null;
}

export interface ArticleTypeUser
  extends Omit<ArticleType, 'user' | 'id' | 'description' | 'label'> {}

export type CategoryType = Omit<
  CategoryModel,
  'createdAt' | 'updatedAt' | 'article'
>;

export type ExerciseType = Omit<ExerciseModel, 'createdAt' | 'updatedAt'>;

export type ExerciseUserType = Omit<
  ExerciseSessionModel,
  'createdAt' | 'updatedAt'
>;
