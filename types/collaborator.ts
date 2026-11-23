export interface CollaboratorSummary {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
}

export interface CollaboratorsResponse {
  isOwner: boolean;
  collaborators: CollaboratorSummary[];
}
