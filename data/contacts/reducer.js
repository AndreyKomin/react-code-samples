import { fromJS } from 'immutable';
import { AUTHENTICATION_SUCCESS } from 'data/user';
import {
  success,
  error,
  loading,
  mergeGroups,
  loadGroupContext,
  searchGroup,
  mergeGroupResults,
  updateGroupContext,
  setGroupContextSelection,
  assignContext,
  unassignContext,
} from 'reducers';
import { DELETE_PROPERTY_GROUP_SUCCESS, DELETE_GROUP_CONTEXT_SUCCESS, SAVE_GROUP_CONTEXT_SUCCESS, SAVE_PROPERTY_SUCCESS } from 'data/property';
import { SAVE_LISTINGS_SUCCESS } from 'data/listing';

import * as ActionType from './actions';


const defaultContact = fromJS({
  id: null,
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  streetAddress: '',
  city: '',
  state: '',
  zip: '',
  mailStreetAddress: '',
  mailCity: '',
  mailState: '',
  mailZip: '',
  mailAddressSame: false,
  typeId: '',
  statusId: '',
});

const defaultAppendJob = fromJS({
  message: '',
  lines: [],
  total: 0,
  dncEnabled: true,
});

const defaultState = fromJS({
  contact: defaultContact,
  appendJob: defaultAppendJob,
  error: null,
  loading: false,
  statuses: [],
  types: [],
  groups: [],
  contexts: {},
});

export default function reducer(state = defaultState, action) {
  const { response } = action;

  switch (action.type) {
    case AUTHENTICATION_SUCCESS:
      return mergeGroups(state, response.contactGroups).merge({ types: response.contactTypes, statuses: response.contactStatuses });

    case ActionType.LOAD_CONTACT:
      return loading(state.set('contact', defaultContact));

    case ActionType.SAVE_CONTACT:
    case ActionType.DELETE_CONTACT_GROUP:
    case ActionType.IMPORT_CONTACTS:
    case ActionType.APPEND_CONTACTS:
    case ActionType.GET_APPEND_JOB:
    case ActionType.UPDATE_APPEND_JOB:
    case ActionType.UPDATE_CONTACT_GROUP:
    case ActionType.DELETE_GROUP_CONTEXT_CONTACT:
    case ActionType.SEARCH_GROUP_CONTEXT_CONTACT:
    case ActionType.SAVE_GROUP_CONTEXT_CONTACT:
    case ActionType.EXPORT_CONTACTS:
    case ActionType.GET_CONTACT_IDS:
      return loading(state);

    case ActionType.LOAD_CONTACT_ERROR:
    case ActionType.SAVE_CONTACT_ERROR:
    case ActionType.DELETE_CONTACT_GROUP_ERROR:
    case ActionType.IMPORT_CONTACTS_ERROR:
    case ActionType.APPEND_CONTACTS_ERROR:
    case ActionType.GET_APPEND_JOB_ERROR:
    case ActionType.UPDATE_APPEND_JOB_ERROR:
    case ActionType.UPDATE_CONTACT_GROUP_ERROR:
    case ActionType.DELETE_GROUP_CONTEXT_CONTACT_ERROR:
    case ActionType.SEARCH_GROUP_CONTEXT_CONTACT_ERROR:
    case ActionType.SAVE_GROUP_CONTEXT_CONTACT_ERROR:
    case ActionType.EXPORT_CONTACTS_ERROR:
    case ActionType.GET_CONTACT_IDS_ERROR:
      return error(state, action);

    case ActionType.LOAD_CONTACT_SUCCESS:
      return success(state.merge({ contact: response }));

    case ActionType.CLEAR_CONTACT:
      return state.set('contact', defaultContact);

    case ActionType.CHANGE_CONTACT:
      return state.setIn(['contact', action.name], action.value);

    case ActionType.SEARCH_GROUP_CONTEXT_CACHED_CONTACT:
      return searchGroup(state, action.context);

    case ActionType.LOAD_GROUP_CONTEXT_CONTACT:
      return loadGroupContext(state, action);

    case ActionType.SEARCH_GROUP_CONTEXT_CONTACT_SUCCESS:
      return success(mergeGroupResults(state, action.context, response));

    case ActionType.UPDATE_GROUP_CONTEXT_CONTACT:
      return updateGroupContext(state, action.context);

    case ActionType.SELECT_GROUP_CONTEXT_CONTACT:
      return setGroupContextSelection(state, action);

    case ActionType.DELETE_CONTACT_GROUP_SUCCESS:
    case ActionType.DELETE_GROUP_CONTEXT_CONTACT_SUCCESS:
    case ActionType.SAVE_GROUP_CONTEXT_CONTACT_SUCCESS:
    case ActionType.APPEND_CONTACTS_SUCCESS:
    case ActionType.UPDATE_APPEND_JOB_SUCCESS:
    case ActionType.UPDATE_CONTACT_GROUP_SUCCESS:
      return success(mergeGroups(state, response));

    case DELETE_PROPERTY_GROUP_SUCCESS:
    case DELETE_GROUP_CONTEXT_SUCCESS:
    case SAVE_GROUP_CONTEXT_SUCCESS:
    case SAVE_LISTINGS_SUCCESS:
    case SAVE_PROPERTY_SUCCESS:
      return success(mergeGroups(state, response.contactGroups));

    case ActionType.ASSIGN_CONTACTS:
      return assignContext(state);

    case ActionType.UNASSIGN_CONTACTS:
      return unassignContext(state);

    case ActionType.SAVE_CONTACT_SUCCESS:
    case ActionType.IMPORT_CONTACTS_SUCCESS:
      return success(mergeGroups(state, response, true));

    case ActionType.GET_APPEND_JOB_SUCCESS:
      return success(state.merge({ appendJob: response }));

    case ActionType.EXPORT_CONTACTS_SUCCESS:
    case ActionType.GET_CONTACT_IDS_SUCCESS:
      return success(state);

    default:
      return state;
  }
}
