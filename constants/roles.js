export const roles = [
  {
    value: 'president',
    displayText: 'President',
    label: 'I am the President',
  },
  {
    value: 'secretary',
    displayText: 'Secretary',
    label: 'I am the Secretary',
  },
  {
    value: 'trustee',
    displayText: 'Trustee',
    label: 'I am a Trustee',
  },
  {
    value: 'staff',
    displayText: 'Staff',
    label: 'I am a Staff',
  },
];

export const getDisplayTextOfRole = _roleValue => {
  console.log("role value - >", _roleValue )
  const _val = roles.filter(function(entry) {
    return entry.value === _roleValue;
  });
  console.log('filtered value', _val);
  if (_val.length > 0) {
    return _val[0].displayText;
  }
  return '';
};
