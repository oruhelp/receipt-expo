import { template1 } from './template1.js';
import { template2 } from './template2.js';
import { template3 } from './template3.js';

export const templates = [
  { name: 'Simple Blue', id: 'template1', html: template1 },
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
  console.log('Going to generate html in sercive-', receipt);
  if (receipt.sender) {
    _resultHtml = _resultHtml.replace(
      /__receipt.sender.name__/g,
      receipt.sender.name
    );
    _resultHtml = _resultHtml.replace(
      /__receipt.sender.role__/g,
      receipt.sender.role
    );
    _resultHtml = _resultHtml.replace(
      /__receipt.sender.phoneNumber__/g,
      receipt.sender.phoneNumber
    );
    _resultHtml = _resultHtml.replace(
      /__receipt.sender.email__/g,
      receipt.sender.email
    );
  }
  // _resultHtml = _resultHtml.replace('', receipt.approver.name);
  // _resultHtml = _resultHtml.replace('', receipt.approver.role);
  // _resultHtml = _resultHtml.replace('', receipt.approver.phoneNumber);
  // _resultHtml = _resultHtml.replace('', receipt.approver.email);
  if (receipt.receiver) {
    _resultHtml = _resultHtml.replace(
      /__receipt.receiver.name__/g,
      receipt.receiver.name
    );
    _resultHtml = _resultHtml.replace(
      /__receipt.receiver_phoneNumber__/g,
      receipt.receiver.phoneNumber
    );
    _resultHtml = _resultHtml.replace(
      /__receipt.receiver.email__/g,
      receipt.receiver.email
    );
  }
  if (receipt.org) {
    _resultHtml = _resultHtml.replace(
      /__receipt.org.name__/g,
      receipt.org.name
    );
    _resultHtml = _resultHtml.replace(
      /__receipt.org.logoSrc__/g,
      receipt.org.logoSrc
    );
    _resultHtml = _resultHtml.replace(
      /__receipt.org.addressLine1__/g,
      receipt.org.addressLine1
    );
    _resultHtml = _resultHtml.replace(
      /__receipt.org.addressLine2__/g,
      receipt.org.addressLine2
    );
    _resultHtml = _resultHtml.replace(
      /__receipt.org.countryAndPincode__/g,
      receipt.org.registeredCountry + ' ' + receipt.org.pincode
    );
    _resultHtml = _resultHtml.replace(
      /__receipt.org.phoneNumber__/g,
      receipt.org.phoneNumber
    );
    _resultHtml = _resultHtml.replace(
      /__receipt.org.email__/g,
      receipt.org.email
    );
    _resultHtml = _resultHtml.replace(
      /__receipt.org.website__/g,
      receipt.org.website
    );
  }
  if (receipt.donation) {
    _resultHtml = _resultHtml.replace(
      /__receipt.donation.id__/g,
      receipt.donation.id
    );
    _resultHtml = _resultHtml.replace(
      /__receipt.donation.amount__/g,
      receipt.donation.amount
    );
    _resultHtml = _resultHtml.replace(
      /__receipt.donation.date__/g,
      receipt.donation.date
    );
    _resultHtml = _resultHtml.replace(
      /__receipt.donation.description__/g,
      receipt.donation.description
    );
    _resultHtml = _resultHtml.replace(
      /__receipt.donation.footer__/g,
      receipt.donation.footer
    );
  }
  return _resultHtml;
};
