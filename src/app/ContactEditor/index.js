import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Dropdown from 'components/base/Dropdown';
import Radio from 'components/base/Radio';
import FormControlWraper from 'components/base/FormControlWraper';
import Button, { ButtonLink } from 'components/base/Button';
import dropdownNormalize from 'utils/normalizers/dropdown';
import { UsStateShortOptions } from 'data/user/constants';
import { validate, verifyRequired } from 'utils/validation';
import { contactGroupPath } from 'app/routes';
import {
  selectContactTypes,
  selectContactStatuses,
  selectContact,
  selectLoading,
  loadContact,
  clearContact,
  changeContact,
  saveContact,
} from 'data/contacts';

import css from './style.scss';


const Wrapper = ({ name, label, children }) => <FormControlWraper id={name} label={label} className={css.formControlWraper} hasMarginBottom large>{children}</FormControlWraper>;
const LabeledTextInput = ({ name, label, contact = {}, onChange, disabled = false }) => <Wrapper {...{ name, label }}><input name={name} type="text" value={contact[name] || ''} onChange={onChange} disabled={disabled} /></Wrapper>;
const LabeledDropdown = ({ name, label, options, contact = {} }) => <Wrapper {...{ name, label }}><Dropdown name={name} options={options} value={contact[name]} /></Wrapper>;

class ContactEditor extends PureComponent {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.parentPath = contactGroupPath(props.params.groupId);
  }

  componentWillMount() {
    const { loadContact, clearContact, params: { contactId } } = this.props;
    if (contactId) loadContact(Number(contactId));
    else clearContact();
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.props.changeContact(name, name === 'mailAddressSame' ? value === 'true' : value);
  }

  handleSubmit(event) {
    const { history, contact, saveContact } = this.props;
    event.preventDefault();

    validate(() => {
      verifyRequired(null, contact.firstName, 'First Name is required.');
      verifyRequired(null, contact.lastName, 'Last Name is required.');
      verifyRequired(null, contact.typeId, 'Please select a contact type.');
      verifyRequired(null, contact.statusId, 'Please select a contact status.');

      saveContact(contact, () => history.push(this.parentPath));
    });
  }

  render() {
    const { isNewContact, pristine, loading, types, contact, statuses } = this.props;
    const saveButtonText = (isNewContact || !pristine) ? 'Save' : 'Saved';
    const fieldProps = { contact };
    const btn = { isLoading: loading, size: Button.size.large, className: css.btn };

    return (
      <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
        <div className={css.newContact}>
          <div className={css.header}>
            <div className={css.left}>
              <div className={css.title}>{contact.id ? contact.name : 'New Contact'}</div>
            </div>
            <div className={css.right}>
              <ButtonLink {...btn} to={this.parentPath} kind={ButtonLink.kind.grayGhost} disabled={loading}>Cancel</ButtonLink>
              <Button {...btn} type="submit" kind={Button.kind.blue} disabled={pristine || loading}>{saveButtonText}</Button>
            </div>
          </div>
          <div className={css.body}>
            <div className={css.container}>
              <div className={css.row}>
                <div className={css.md}>
                  <LabeledTextInput name="firstName" label="First Name*" {...fieldProps} />
                </div>
                <div className={css.md}>
                  <LabeledTextInput name="lastName" label="Last Name*" {...fieldProps} />
                </div>
                <div className={css.xl}>
                  <LabeledTextInput name="email" label="Email" {...fieldProps} />
                </div>
                <div className={css.md}>
                  <LabeledTextInput name="phone" label="Phone" {...fieldProps} />
                </div>
              </div>
              <div className={css.row}>
                <div className={css.lg}>
                  <LabeledTextInput name="streetAddress" label="Property Address" {...fieldProps} />
                </div>
                <div className={css.sm}>
                  <LabeledTextInput name="city" label="City" {...fieldProps} />
                </div>
                <div className={css.xs}>
                  <LabeledDropdown name="state" label="State" options={UsStateShortOptions} {...fieldProps} />
                </div>
                <div className={css.xs}>
                  <LabeledTextInput name="zip" label="Zip" {...fieldProps} />
                </div>
                <div className={css.radio}>
                  <Wrapper name="mailAddressSame" label="Same Mailing Address?">
                    <div className={css.radioRow}>
                      {[true, false].map(val => <Radio type="radio" value={val} key={val} label={val ? 'Yes' : 'No'} name="mailAddressSame" checked={val === contact.mailAddressSame} />)}
                    </div>
                  </Wrapper>
                </div>
              </div>
              <div className={css.row}>
                <div className={css.lg}>
                  <LabeledTextInput name="mailStreetAddress" label="Mailing Address" {...fieldProps} />
                </div>
                <div className={css.sm}>
                  <LabeledTextInput name="mailCity" label="city" {...fieldProps} />
                </div>
                <div className={css.xs}>
                  <LabeledDropdown name="mailState" label="State" options={UsStateShortOptions} {...fieldProps} />
                </div>
                <div className={css.xs}>
                  <LabeledTextInput name="mailZip" label="Zip" {...fieldProps} />
                </div>
              </div>
              <div className={css.row}>
                <div className={css.sm}>
                  <LabeledDropdown name="typeId" label="Contact Type*" options={dropdownNormalize(types)} {...fieldProps} />
                </div>
                <div className={css.sm}>
                  <LabeledDropdown name="statusId" label="Status*" options={dropdownNormalize(statuses)} {...fieldProps} />
                </div>
              </div>
              {!contact.landline && !contact.cell && !contact.cell2 && !contact.email2 && !contact.email3 ? null : (
                <div className={css.appended}>
                  <div className={css.row}>
                    <div className={css.appendHeader}>Appended Information</div>
                  </div>
                  <div className={css.row}>
                    {!contact.email2 ? null : (<div className={css.email}>
                      <LabeledTextInput name="email2" label="Email" {...fieldProps} disabled />
                    </div>)}
                    {!contact.email3 ? null : (<div className={css.email}>
                      <LabeledTextInput name="email3" label="Email 2" {...fieldProps} disabled />
                    </div>)}
                  </div>
                  <div className={css.row}>
                    {!contact.landline ? null : (<div className={css.phone}>
                      <LabeledTextInput name="landline" label="Landline" {...fieldProps} disabled />
                    </div>)}
                    {!contact.cell ? null : (<div className={css.phone}>
                      <LabeledTextInput name="cell" label="Cell Phone" {...fieldProps} disabled />
                    </div>)}
                    {!contact.cell2 ? null : (<div className={css.phone}>
                      <LabeledTextInput name="cell2" label="Cell Phone 2" {...fieldProps} disabled />
                    </div>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    );
  }
}

ContactEditor.defaultProps = {
  title: 'New Contact',
};

export default connect(state => ({
  statuses: selectContactStatuses(state),
  types: selectContactTypes(state),
  contact: selectContact(state).toJS(),
  loading: selectLoading(state),
}), {
  loadContact,
  changeContact,
  saveContact,
  clearContact,
})(ContactEditor);

