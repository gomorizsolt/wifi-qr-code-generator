import Layout from './Layout';
import { useEffect, useRef, useState } from 'react';
import { toDataURL } from 'qrcode';
import toast, { Toaster } from 'react-hot-toast';
import { isFilledWithEmptySpaces, escapeString } from '../utils/helpers';

interface FormData {
  SSID: string;
  type: 'WEP' | 'WPA' | 'nopass';
  password: string; // * ignored when T is nopass
  hidden: boolean;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    SSID: '',
    type: 'WEP',
    password: '',
    hidden: false,
  });
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [barcode, setBarcode] = useState('');

  useEffect(() => {
    if (!!submitButtonRef.current) {
      if (isFilledWithEmptySpaces(formData.SSID) || formData.SSID === '') {
        return disableSubmitButton();
      }

      if (formData.type !== 'nopass' && (isFilledWithEmptySpaces(formData.password) || formData.password === '')) {
        return disableSubmitButton();
      }

      submitButtonRef.current.disabled = false;
    }
  }, [formData.SSID, formData.type, formData.password]);

  function disableSubmitButton() {
    if (!!submitButtonRef.current) {
      submitButtonRef.current.disabled = true;
    }
  }

  function handleFormDataChange(event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  }

  function buildQueryString() {
    let result = `WIFI:S:${escapeString(formData.SSID)};T:${formData.type};`;

    if (formData.type !== 'nopass') {
      result += `P:${escapeString(formData.password)};`;
    }

    if (formData.hidden) {
      result += `H:true;`;
    }

    return `${result};`;
  }

  function generateQRCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const promise = toDataURL(buildQueryString());

    toast.promise(
      promise,
      {
        loading: 'Generating QR code ...',
        success: (result) => {
          setBarcode(result);

          return 'QR code has been successfully generated.';
        },
        error: 'Something went wrong, please try again.',
      },
      {
        style: {
          minWidth: '400px',
        },
      }
    );
  }

  return (
    <Layout>
      <Toaster />

      <form className="grid grid-cols-1 gap-6" onSubmit={generateQRCode}>
        <label className="block">
          <span className="text-gray-700">SSID</span>
          <input
            type="text"
            name="SSID"
            className="mt-0 block w-full rounded-b-sm border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-500"
            onChange={handleFormDataChange}
            value={formData.SSID}
          />
        </label>

        <label className="block my-4">
          <span className="text-gray-700">Authentication type</span>
          <select
            className="block w-full rounded-b-sm border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-500 bg-white"
            name="type"
            onChange={handleFormDataChange}
            value={formData.type}
          >
            <option value="WEP">WEP</option>
            <option value="WPA">WPA / WPA2</option>
            <option value="nopass">None</option>
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            name="password"
            className="mt-0 block w-full rounded-b-sm border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-500"
            onChange={handleFormDataChange}
            value={formData.password}
          />
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            name="hidden"
            className="bg-blue-100 border-transparent rounded-sm text-blue-500"
            onChange={() =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                hidden: !prevFormData.hidden,
              }))
            }
            checked={formData.hidden}
          />
          <span className="text-gray-700 ml-2">Hidden</span>
        </label>

        <button
          type="submit"
          className="bg-blue-300 hover:bg-blue-500 transition-colors duration-200 ease-in rounded-sm py-4 text-gray-700 disabled:text-gray-400 hover:text-gray-100 disabled:bg-blue-100 disabled:cursor-not-allowed"
          ref={submitButtonRef}
        >
          Create QR
        </button>
      </form>

      {barcode && <img className="mx-auto p-4" src={barcode} alt="Wi-Fi QR Code" />}
    </Layout>
  );
}

export default App;
