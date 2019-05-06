import { CALL_API } from 'store/middleware/api';
import { getFormData } from 'utils/type/isFormData';


export const CHANGE_CONTACT = Symbol('CHANGE_CONTACT');
export const CLEAR_CONTACT = Symbol('CLEAR_CONTACT');
export const LOAD_GROUP_CONTEXT_CONTACT = Symbol('LOAD_GROUP_CONTEXT_CONTACT');
export const SEARCH_GROUP_CONTEXT_CACHED_CONTACT = Symbol('SEARCH_GROUP_CONTEXT_CACHED_CONTACT');
export const UPDATE_GROUP_CONTEXT_CONTACT = Symbol('UPDATE_GROUP_CONTEXT_CONTACT');
export const SELECT_GROUP_CONTEXT_CONTACT = Symbol('SELECT_GROUP_CONTEXT_CONTACT');
export const ASSIGN_CONTACTS = Symbol('ASSIGN_CONTACTS');
export const UNASSIGN_CONTACTS = Symbol('UNASSIGN_CONTACTS');

export const LOAD_CONTACT = Symbol('LOAD_CONTACT');
export const LOAD_CONTACT_ERROR = Symbol('LOAD_CONTACT_ERROR');
export const LOAD_CONTACT_SUCCESS = Symbol('LOAD_CONTACT_SUCCESS');
export const SAVE_CONTACT = Symbol('SAVE_CONTACT');
export const SAVE_CONTACT_SUCCESS = Symbol('SAVE_CONTACT_SUCCESS');
export const SAVE_CONTACT_ERROR = Symbol('SAVE_CONTACT_ERROR');
export const DELETE_CONTACT_GROUP = Symbol('DELETE_CONTACT_GROUP');
export const DELETE_CONTACT_GROUP_SUCCESS = Symbol('DELETE_CONTACT_GROUP_SUCCESS');
export const DELETE_CONTACT_GROUP_ERROR = Symbol('DELETE_CONTACT_GROUP_ERROR');
export const IMPORT_CONTACTS = Symbol('IMPORT_CONTACTS');
export const IMPORT_CONTACTS_SUCCESS = Symbol('IMPORT_CONTACTS_SUCCESS');
export const IMPORT_CONTACTS_ERROR = Symbol('IMPORT_CONTACTS_ERROR');
export const EXPORT_CONTACTS = Symbol('EXPORT_CONTACTS');
export const EXPORT_CONTACTS_SUCCESS = Symbol('EXPORT_CONTACTS_SUCCESS');
export const EXPORT_CONTACTS_ERROR = Symbol('EXPORT_CONTACTS_ERROR');
export const APPEND_CONTACTS = Symbol('APPEND_CONTACTS');
export const APPEND_CONTACTS_SUCCESS = Symbol('APPEND_CONTACTS_SUCCESS');
export const APPEND_CONTACTS_ERROR = Symbol('APPEND_CONTACTS_ERROR');
export const GET_APPEND_JOB = Symbol('GET_APPEND_JOB');
export const GET_APPEND_JOB_SUCCESS = Symbol('GET_APPEND_JOB_SUCCESS');
export const GET_APPEND_JOB_ERROR = Symbol('GET_APPEND_JOB_ERROR');
export const UPDATE_APPEND_JOB = Symbol('UPDATE_APPEND_JOB');
export const UPDATE_APPEND_JOB_SUCCESS = Symbol('UPDATE_APPEND_JOB_SUCCESS');
export const UPDATE_APPEND_JOB_ERROR = Symbol('UPDATE_APPEND_JOB_ERROR');
export const UPDATE_CONTACT_GROUP = Symbol('UPDATE_CONTACT_GROUP');
export const UPDATE_CONTACT_GROUP_SUCCESS = Symbol('UPDATE_CONTACT_GROUP_SUCCESS');
export const UPDATE_CONTACT_GROUP_ERROR = Symbol('UPDATE_CONTACT_GROUP_ERROR');
export const SEARCH_GROUP_CONTEXT_CONTACT = Symbol('SEARCH_GROUP_CONTEXT_CONTACT');
export const SEARCH_GROUP_CONTEXT_CONTACT_SUCCESS = Symbol('SEARCH_GROUP_CONTEXT_CONTACT_SUCCESS');
export const SEARCH_GROUP_CONTEXT_CONTACT_ERROR = Symbol('SEARCH_GROUP_CONTEXT_CONTACT_ERROR');
export const DELETE_GROUP_CONTEXT_CONTACT = Symbol('DELETE_GROUP_CONTEXT_CONTACT');
export const DELETE_GROUP_CONTEXT_CONTACT_SUCCESS = Symbol('DELETE_GROUP_CONTEXT_CONTACT_SUCCESS');
export const DELETE_GROUP_CONTEXT_CONTACT_ERROR = Symbol('DELETE_GROUP_CONTEXT_CONTACT_ERROR');
export const SAVE_GROUP_CONTEXT_CONTACT = Symbol('SAVE_GROUP_CONTEXT_CONTACT');
export const SAVE_GROUP_CONTEXT_CONTACT_SUCCESS = Symbol('SAVE_GROUP_CONTEXT_CONTACT_SUCCESS');
export const SAVE_GROUP_CONTEXT_CONTACT_ERROR = Symbol('SAVE_GROUP_CONTEXT_CONTACT_ERROR');
export const GET_CONTACT_IDS = Symbol('GET_CONTACT_IDS');
export const GET_CONTACT_IDS_SUCCESS = Symbol('GET_CONTACT_IDS_SUCCESS');
export const GET_CONTACT_IDS_ERROR = Symbol('GET_CONTACT_IDS_ERROR');

const request = data => ({ [CALL_API]: data });

function contacts(method, path, startType, successType, errorType, body, { afterSuccess, afterError, successParams, query, download } = {}) {
  return request({
    method,
    startType,
    successType,
    errorType,
    body,
    path: `/resource/auth/ps4/user/contacts/${path}`,
    // ...(method === 'post' && !isFormData(body) ? { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } } : {}),
    afterSuccess,
    afterError,
    successParams,
    query,
    download,
  });
}

const getSearch = context => context.merge({ data: null, info: null, fullSelection: null, name: context.getIn(['info', 'name']), type: context.getIn(['info', 'type']) });

export const loadContact = id => contacts('get', `new/${id}`, LOAD_CONTACT, LOAD_CONTACT_SUCCESS, LOAD_CONTACT_ERROR);

export const saveContact = (contact, afterSuccess) => contacts('put', 'new', SAVE_CONTACT, SAVE_CONTACT_SUCCESS, SAVE_CONTACT_ERROR, contact, { afterSuccess });

export const importContacts = (file, groupName, afterSuccess) => contacts('post', 'new', IMPORT_CONTACTS, IMPORT_CONTACTS_SUCCESS, IMPORT_CONTACTS_ERROR, getFormData([{ name: 'contacts', file }, { name: 'groupName', value: groupName || '' }]), { afterSuccess });

export const appendContacts = (data, paymentMethodId, afterSuccess) => contacts('post', 'new/appends', APPEND_CONTACTS, APPEND_CONTACTS_SUCCESS, APPEND_CONTACTS_ERROR, data, { afterSuccess, query: { paymentMethodId } });

export const getAppendJobEstimate = (data, afterSuccess) => contacts('post', 'appends/jobs', GET_APPEND_JOB, GET_APPEND_JOB_SUCCESS, GET_APPEND_JOB_ERROR, data, { afterSuccess });

export const getAppendJob = (id, afterSuccess) => contacts('get', `appends/jobs/${id}`, GET_APPEND_JOB, GET_APPEND_JOB_SUCCESS, GET_APPEND_JOB_ERROR, null, { afterSuccess });

export const updateAppendJob = (job, afterSuccess) => contacts('put', 'appends', UPDATE_APPEND_JOB, UPDATE_APPEND_JOB_SUCCESS, UPDATE_APPEND_JOB_ERROR, job, { afterSuccess });

export const updateContactGroup = group => contacts('put', 'new/groups/update', UPDATE_CONTACT_GROUP, UPDATE_CONTACT_GROUP_SUCCESS, UPDATE_CONTACT_GROUP_ERROR, group);

export const clearContact = () => ({ type: CLEAR_CONTACT });

export const changeContact = (name, value) => ({ type: CHANGE_CONTACT, name, value });

export const loadGroupContext = (name, groupId, defaults) => ({ type: LOAD_GROUP_CONTEXT_CONTACT, name, groupId, defaults });

export const searchGroupContext = (context) => {
  if (context.getIn(['info', 'data'])) return { type: SEARCH_GROUP_CONTEXT_CACHED_CONTACT, context };
  return contacts('post', 'new/groups', SEARCH_GROUP_CONTEXT_CONTACT, SEARCH_GROUP_CONTEXT_CONTACT_SUCCESS, SEARCH_GROUP_CONTEXT_CONTACT_ERROR, getSearch(context).set('selection', null), { successParams: { context } });
};

export const loadContextIds = (context, selection) => contacts('post', 'new/groups', SEARCH_GROUP_CONTEXT_CONTACT, SEARCH_GROUP_CONTEXT_CONTACT_SUCCESS, SEARCH_GROUP_CONTEXT_CONTACT_ERROR, { selection }, { successParams: { context } });

export const updateGroupContext = context => ({ type: UPDATE_GROUP_CONTEXT_CONTACT, context });

export const updateGroupContextSelection = (context, select, index) => ({ type: SELECT_GROUP_CONTEXT_CONTACT, context, select, index });

export const deleteGroupContext = context => contacts('delete', 'new', DELETE_GROUP_CONTEXT_CONTACT, DELETE_GROUP_CONTEXT_CONTACT_SUCCESS, DELETE_GROUP_CONTEXT_CONTACT_ERROR, getSearch(context));

export const getContactIds = (id, afterSuccess) => contacts('get', `new/groups/${id}/ids`, GET_CONTACT_IDS, GET_CONTACT_IDS_SUCCESS, GET_CONTACT_IDS_ERROR, null, { afterSuccess });

export const searchContactIds = (context, afterSuccess) => contacts('post', 'new/groups/ids', GET_CONTACT_IDS, GET_CONTACT_IDS_SUCCESS, GET_CONTACT_IDS_ERROR, getSearch(context), { afterSuccess });

export const saveGroupContext = (context, afterSuccess) => contacts('put', 'new/groups', SAVE_GROUP_CONTEXT_CONTACT, SAVE_GROUP_CONTEXT_CONTACT_SUCCESS, SAVE_GROUP_CONTEXT_CONTACT_ERROR, getSearch(context), { afterSuccess });

export const exportContacts = context => contacts('post', 'new/export', EXPORT_CONTACTS, EXPORT_CONTACTS_SUCCESS, EXPORT_CONTACTS_ERROR, getSearch(context), { download: true });

export const deleteContactGroup = groupId => contacts('delete', `new/groups/${groupId.substr(1)}`, DELETE_CONTACT_GROUP, DELETE_CONTACT_GROUP_SUCCESS, DELETE_CONTACT_GROUP_ERROR);

export const assignContext = () => ({ type: ASSIGN_CONTACTS });

export const unassignContext = () => ({ type: UNASSIGN_CONTACTS });
