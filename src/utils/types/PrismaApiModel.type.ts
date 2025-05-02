import {
  Role as RoleModel,
  Citizen as CitizenModel,
  Comment as CommentModel,
  File as FileModel,
  Ressource as ResourceModel,
  Step as StepModel,
  Progression as ProgressionModel,
  Category as CategoryModel,
  Favorite as FavoriteModel,
  Message as MessageModel,
  Invite as InviteModel,
  TypeRessource as TypeRessourceModel,
} from '@prisma/client';
import { RessourceStatus } from '../ressourceStatus.enum';

export interface CitizenType
  extends Omit<
    CitizenModel,
    'password' | 'roleId' | 'createdAt' | 'updatedAt' | 'clerkId'
  > {
  role: Omit<RoleModel, 'createdAt' | 'updatedAt'>;
}

export interface RessourceType
  extends Omit<
    ResourceModel,
    | 'category'
    | 'categoryId'
    | 'createdAt'
    | 'updatedAt'
    | 'fileId'
    | 'banner'
    | 'bannerId'
    | 'file'
    | 'comment'
    | 'typeRessourceId'
    | 'citizenId'
  > {
  file?: Omit<FileModel, 'resources'> | null;
  step: Array<Omit<StepModel, 'ressourceId'> | null>;
  typeRessource: TypeRessourceType;
  citizen: Pick<CitizenType, 'id' | 'name' | 'surname'> | null;
  isValidate: boolean;
  status: string;
}

export interface RessourceTypeCitizen
  extends Omit<
    RessourceType,
    | 'step'
    | 'typeRessource'
    | 'citizen'
    | 'id'
    | 'description'
    | 'title'
    | 'maxParticipant'
    | 'nbParticipant'
    | 'deadLine'
  > {}

export interface RessourceWithCommentType extends RessourceType {
  comment: Array<RessourceComment | null>;
}

interface RessourceComment
  extends Omit<
    CommentModel,
    'createdAt' | 'ressourceId' | 'citizen' | 'citizenId'
  > {
  citizen: Pick<CitizenModel, 'name' | 'surname'>;
}

export type FileType = Omit<FileModel, 'resources'>;

export interface CommentType
  extends Omit<CommentModel, 'citizenId' | 'createdAt'> {
  citizen: Omit<
    CitizenType,
    'role' | 'createdAt' | 'updatedAt' | 'email' | 'id' | 'comment'
  >;
}

export type CategoryType = Omit<
  CategoryModel,
  'createdAt' | 'updatedAt' | 'ressource'
>;

export type ProgressionType = Omit<ProgressionModel, 'createdAt' | 'updatedAd'>;

export type StepType = Omit<StepModel, 'id'>;

export type FavoriteType = Omit<
  FavoriteModel,
  'createdAt' | 'updatedAt' | 'ressourceId'
>;

export interface MessageType
  extends Omit<MessageModel, 'id' | 'citizenId' | 'createdAt'> {
  citizen: Omit<CitizenType, 'role' | 'email' | 'id' | 'Comment'>;
}

export interface InviteType
  extends Omit<
    InviteModel,
    'createdAt' | 'receverId' | 'senderId' | 'ressourceId'
  > {
  recever: Omit<CitizenType, 'role' | 'id' | 'email'>;
  sender: Omit<CitizenType, 'role' | 'id' | 'email'>;
  ressource: Pick<RessourceType, 'title'>;
}

export type TypeRessourceType = Omit<
  TypeRessourceModel,
  'createdAt' | 'updatedAt'
>;
