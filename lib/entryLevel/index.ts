'use strict';

import * as allergyEntryLevel from './allergyEntryLevel';
import * as encounterEntryLevel from './encounterEntryLevel';
import * as immunizationEntryLevel from './immunizationEntryLevel';
import * as medicationEntryLevel from './medicationEntryLevel';
import * as payerEntryLevel from './payerEntryLevel';
import * as planOfCareEntryLevel from './planOfCareEntryLevel';
import * as problemEntryLevel from './problemEntryLevel';
import * as procedureEntryLevel from './procedureEntryLevel';
import * as resultEntryLevel from './resultEntryLevel';
import * as socialHistoryEntryLevel from './socialHistoryEntryLevel';
import * as vitalSignEntryLevel from './vitalSignEntryLevel';

export const allergyProblemAct = allergyEntryLevel.allergyProblemAct;
export const medicationActivity = medicationEntryLevel.medicationActivity;
export const immunizationActivity = immunizationEntryLevel.immunizationActivity;
export const problemConcernAct = problemEntryLevel.problemConcernAct;
export const encounterActivities = encounterEntryLevel.encounterActivities;
export const procedureActivityAct = procedureEntryLevel.procedureActivityAct;
export const procedureActivityProcedure = procedureEntryLevel.procedureActivityProcedure;
export const procedureActivityObservation = procedureEntryLevel.procedureActivityObservation;
export const planOfCareActivityAct = planOfCareEntryLevel.planOfCareActivityAct;
export const planOfCareActivityObservation = planOfCareEntryLevel.planOfCareActivityObservation;
export const planOfCareActivityProcedure = planOfCareEntryLevel.planOfCareActivityProcedure;
export const planOfCareActivityEncounter = planOfCareEntryLevel.planOfCareActivityEncounter;
export const planOfCareActivitySubstanceAdministration =
  planOfCareEntryLevel.planOfCareActivitySubstanceAdministration;
export const planOfCareActivitySupply = planOfCareEntryLevel.planOfCareActivitySupply;
export const planOfCareActivityInstructions = planOfCareEntryLevel.planOfCareActivityInstructions;
export const coverageActivity = payerEntryLevel.coverageActivity;
export const vitalSignsOrganizer = vitalSignEntryLevel.vitalSignsOrganizer;
export const resultOrganizer = resultEntryLevel.resultOrganizer;
export const socialHistoryObservation = socialHistoryEntryLevel.socialHistoryObservation;
export const smokingStatusObservation = socialHistoryEntryLevel.smokingStatusObservation;
