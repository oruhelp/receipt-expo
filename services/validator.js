export const checkValidator = _validator => {
  for (var prop in _validator) {
    if (Object.prototype.hasOwnProperty.call(_validator, prop)) {
      console.log(prop, _validator[prop]);
      if (_validator[prop].failed) {
        return false;
      }
    }
  }
  return true;
};

export const validateEmail = _email => {
  if (_email.trim() == '') {
    return { failed: true, errorMessage: 'Email should not be blank' };
  }
  const _result = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    _email
  );
  return {
    failed: !_result,
    errorMessage: !_result ? 'Not a valid email' : '',
  };
};

export const validateName = _name => {
  if (_name.trim() == '') {
    return { failed: true, errorMessage: 'Name should not be blank' };
  }
  const _result = /^[a-zA-Z]+(\s{0,1}[a-zA-Z ])*$/.test(_name);
  return {
    failed: !_result,
    errorMessage: !_result ? 'Only alphabet and space are allowed' : '',
  };
};

export const validateUserName = _name => {
  if (_name.trim().length < 4) {
    return {
      failed: true,
      errorMessage: 'Username should be atlease 4 characters',
    };
  }
  const _result = /^[a-z0-9]+$/i.test(_name);
  return {
    failed: !_result,
    errorMessage: !_result ? 'Username should be alphanumeric only' : '',
  };
};
