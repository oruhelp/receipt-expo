import { template1 } from './template1.js';
import { template2 } from './template2.js';
import { template3 } from './template3.js';

export const templates = [
  { name: 'Simple Blue', id: 'template1', html: template1 },
  { name: 'Certificate', id: 'template2', html: template2 },
  { name: 'Lite', id: 'template3', html: template3 },
];

const data = {
  sender: {
    name: 'Karthikeyan',
    role: 'Volunteer',
    phoneNumber: '+91-7708662218',
    email: 'karthikeyan@gmail.com',
  },
  approver: {
    name: 'Surya Kumar',
    role: 'President',
    phoneNumber: '+91-1234567890',
    email: 'suryakmr@gmail.com',
  },
  receiver: {
    name: 'Guru',
    phoneNumber: '+91-9659657101',
    email: 'rajfml@gmail.com',
  },
  org: {
    name: 'Aarathy Charitable Trust',
    addressLine1: '10, VGP Santhi Nagar',
    addressLine2: 'Pallikaranai, Chennai',
    countryAndPincode: 'India, 600100',
    phoneNumber: '+91-0987654321',
    email: 'info@aarathy.org',
    website: 'www.aarathy.org',
  },
  donation: {
    id: '23423243',
    amount: '1000',
    date: '18/Mar/2020',
    description: 'This is donated for student education',
    footer: 'From PostMan',
  },
};

export const getCompletedHtml = (_template, receipt) => {
  let _resultHtml = _template;
  _resultHtml = _resultHtml.replace(
    '__receipt.sender.name__',
    receipt.sender.name
  );
  _resultHtml = _resultHtml.replace(
    '__receipt.sender.role__',
    receipt.sender.role
  );
  _resultHtml = _resultHtml.replace(
    '__receipt.sender.phoneNumber__',
    receipt.sender.phoneNumber
  );
  _resultHtml = _resultHtml.replace(
    '__receipt.sender.email__',
    receipt.sender.email
  );
  // _resultHtml = _resultHtml.replace('', receipt.approver.name);
  // _resultHtml = _resultHtml.replace('', receipt.approver.role);
  // _resultHtml = _resultHtml.replace('', receipt.approver.phoneNumber);
  // _resultHtml = _resultHtml.replace('', receipt.approver.email);
  _resultHtml = _resultHtml.replace(
    '__receipt.receiver.name__',
    receipt.receiver.name
  );
  _resultHtml = _resultHtml.replace(
    '__receipt.receiver_phoneNumber__',
    receipt.receiver.phoneNumber
  );
  _resultHtml = _resultHtml.replace(
    '__receipt.receiver.email__',
    receipt.receiver.email
  );
  _resultHtml = _resultHtml.replace('__receipt.org.name__', receipt.org.name);
  _resultHtml = _resultHtml.replace(
    '__receipt.org.addressLine1__',
    receipt.org.addressLine1
  );
  _resultHtml = _resultHtml.replace(
    '__receipt.org.addressLine2__',
    receipt.org.addressLine2
  );
  _resultHtml = _resultHtml.replace(
    '__receipt.org.countryAndPincode__',
    receipt.org.countryAndPincode
  );
  _resultHtml = _resultHtml.replace(
    '__receipt.org.phoneNumber__',
    receipt.org.phoneNumber
  );
  _resultHtml = _resultHtml.replace('__receipt.org.email__', receipt.org.email);
  _resultHtml = _resultHtml.replace(
    '__receipt.org.website__',
    receipt.org.website
  );
  _resultHtml = _resultHtml.replace(
    '__receipt.donation.id__',
    receipt.donation.id
  );
  _resultHtml = _resultHtml.replace(
    '__receipt.donation.amount__',
    receipt.donation.amount
  );
  _resultHtml = _resultHtml.replace(
    '__receipt.donation.date__',
    receipt.donation.date
  );
  _resultHtml = _resultHtml.replace(
    '__receipt.donation.description__',
    receipt.donation.description
  );
  _resultHtml = _resultHtml.replace(
    '__receipt.donation.footer__',
    receipt.donation.footer
  );
  return _resultHtml;
};
