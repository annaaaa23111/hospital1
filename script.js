const form = document.getElementById('appointmentForm');
const successMsg = document.getElementById('successMsg');

const fields = [
  'lastName', 'firstName', 'middleName', 'birthDate',
  'snils', 'address', 'phone',
  'doctor', 'visitDate', 'visitTime'
];

const nameRegex = /^[А-Яа-яЁёA-Za-z\-]{2,}$/;
const snilsRegex = /^\d{3}-\d{3}-\d{3} \d{2}$/;
const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

function showError(id, show) {
  const input = document.getElementById(id);
  const err = document.getElementById('err-' + id);
  if (!input || !err) return;
  input.classList.toggle('invalid', show);
  err.classList.toggle('show', show);
}

function todayStr() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function validateField(id) {
  const el = document.getElementById(id);
  const value = el.value.trim();
  var valid = true;

  switch (id) {
    case 'lastName':
    case 'firstName':
    case 'middleName':
      valid = nameRegex.test(value);
      break;
    case 'birthDate':
      if (!value) { valid = false; break; }
      valid = new Date(value) <= new Date();
      break;
    case 'snils':
      valid = snilsRegex.test(value);
      break;
    case 'address':
      valid = value.length >= 5;
      break;
    case 'phone':
      valid = phoneRegex.test(value);
      break;
    case 'doctor':
    case 'visitTime':
      valid = value !== '';
      break;
    case 'visitDate':
      if (!value) { valid = false; break; }
      valid = value >= todayStr();
      break;
  }

  showError(id, !valid);
  return valid;
}

const visitDateInput = document.getElementById('visitDate');
visitDateInput.min = todayStr();
document.getElementById('birthDate').max = todayStr();

document.getElementById('snils').addEventListener('input', (e) => {
  var digits = e.target.value.replace(/\D/g, '').slice(0, 11);
  var result = digits;
  if (digits.length > 3) result = digits.slice(0, 3) + '-' + digits.slice(3);
  if (digits.length > 6) result = digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
  if (digits.length > 9) result = digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6, 9) + ' ' + digits.slice(9);
  e.target.value = result;
});

document.getElementById('phone').addEventListener('input', (e) => {
  var digits = e.target.value.replace(/\D/g, '');
  if (digits.startsWith('8')) digits = '7' + digits.slice(1);
  if (!digits.startsWith('7')) digits = '7' + digits;
  digits = digits.slice(0, 11);

  var result = '+7';
  if (digits.length > 1) result += ' (' + digits.slice(1, 4);
  if (digits.length >= 5) result += ') ' + digits.slice(4, 7);
  if (digits.length >= 8) result += '-' + digits.slice(7, 9);
  if (digits.length >= 10) result += '-' + digits.slice(9, 11);
  e.target.value = result;
});

fields.forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('blur', () => validateField(id));
  el.addEventListener('change', () => validateField(id));
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  successMsg.classList.remove('show');

  var allValid = true;
  fields.forEach(id => {
    if (!validateField(id)) allValid = false;
  });

  if (allValid) {
    successMsg.classList.add('show');
    form.reset();
    fields.forEach(id => showError(id, false));
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});
