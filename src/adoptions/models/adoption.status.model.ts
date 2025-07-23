export enum StatusResultAdoption {
  NOT_EVALUATED = 'not_evaluated',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  BANNED = 'banned',
}

export enum StatusRequestAdoption {
  CREATED = 'created',
  SUITABLE = 'suitable',
  SELECTED_ANIMAL = 'selected_animal',
  CANCELLED = 'cancelled',
  ADOPTION_COMPLETED = 'adoption_completed',
}

export enum StatusSterilisationAdoption {
  sterilized = 'sterilized',
  follow_up_scheduled = 'follow_up_scheduled',
  in_follow_up = 'in_follow_up',
  clinic_request_pending = 'clinic_request_pending',
  cancelled_due_to_no_contact = 'cancelled_due_to_no_contact',
}
