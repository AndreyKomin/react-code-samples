import { createSelector } from 'reselect';
import { defaultContextMap, defaultGroupContextMap, defaultGroupId } from 'reducers';

import ContactGroupTypes from './constants';


const filterType = (list, type) => list.filter(g => g.get('type') === type);

const checkState = state => state;

const selectContacts = createSelector(checkState, state => state.get('contacts'));

export const selectContact = createSelector(selectContacts, state => state.get('contact'));

export const selectContactTypes = createSelector(selectContacts, state => state.get('types'));

export const selectContactStatuses = createSelector(selectContacts, state => state.get('statuses'));

export const selectLoading = createSelector(selectContacts, state => state.get('loading'));

export const selectAppendJob = createSelector(selectContacts, state => state.get('appendJob'));

export const selectContactAssignableGroups = createSelector(selectContacts, state => state.get('groups').filter(g => g.get('type') === ContactGroupTypes.CONTACT && g.get('id')));

export const selectGroupContext = name => createSelector(selectContacts, s => s.getIn(['contexts', name], defaultContextMap).get('group') || defaultGroupContextMap);

export const selectGroups = createSelector(selectContacts, state => state.get('groups').filter(g => !!g.get('type')));

export const selectContactGroups = createSelector(selectGroups, groups => filterType(groups, ContactGroupTypes.CONTACT));

export const selectAppendGroups = createSelector(selectGroups, groups => filterType(groups, ContactGroupTypes.APPEND));

export const selectAssignableGroups = createSelector(selectContactGroups, groups => groups.filter(group => group.get('id') !== defaultGroupId));
