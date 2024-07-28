import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

const productOptions = [
  { value: 'Product 1', label: 'Product 1' },
  { value: 'Product 2', label: 'Product 2' },
  { value: 'Product 3', label: 'Product 3' },
  // Add more products as needed
];

const quantityOptions = [
  { value: 0, label: '0' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];

const OrderForm = () => {
  const [rows, setRows] = useState([{ product: null, quantity: null }]);
  const [showOrder, setShowOrder] = useState(false);

  const handleAddRow = () => {
    setRows([...rows, { product: null, quantity: null }]);
  };

  const handleProductChange = (index, selectedOption) => {
    const newRows = [...rows];
    newRows[index].product = selectedOption;
    setRows(newRows);
  };

  const handleQuantityChange = (index, selectedOption) => {
    const newRows = [...rows];
    newRows[index].quantity = selectedOption;
    setRows(newRows);
  };

  const handleShowOrder = () => {
    const filledRows = rows.filter(row => row.product && row.quantity);
    setRows(filledRows);
    setShowOrder(true);
  };

  const handleTextToSpeech = async () => {
    const orderText = rows
      .filter(row => row.product && row.quantity)
      .map(row => `your ${row.product.label} with quantity ${row.quantity.label}.  Thanku for shoping. have your good day`)
      .join(', ');
  
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://api.voicerss.org/',
        params: {
          key: 'b4d464d91a03429aaf27a31505dd90c9',
          src: orderText,
          hl: 'en-us',
          r: '0',
          c: 'mp3',
          f: '8khz_8bit_mono'
        },
        responseType: 'blob' // Ensure the response type is set to 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'audio/mpeg' }));
      const audio = new Audio(url);
      audio.play();
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>Product Name</div>
        <div>Quantity</div>
      </div>
      {rows.map((row, index) => (
        <div key={index} className="grid grid-cols-2 gap-4 mb-4">
          <Select
            placeholder="Choose Product"
            value={row.product}
            onChange={selectedOption => handleProductChange(index, selectedOption)}
            options={productOptions}
            isClearable
          />
          <Select
            placeholder="Choose Quantity"
            value={row.quantity}
            onChange={selectedOption => handleQuantityChange(index, selectedOption)}
            options={quantityOptions}
            isClearable
          />
        </div>
      ))}
      {rows.length < 8 && (
        <button onClick={handleAddRow} className="bg-blue-500 text-white px-4 py-2 rounded">
          ADD
        </button>
      )}
      <button onClick={handleShowOrder} className="bg-green-500 text-white px-4 py-2 rounded mt-4">
        Show Order
      </button>

      {showOrder && (
        <div>
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>Product Name</div>
              <div>Quantity</div>
            </div>
            {rows.map((row, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                <div>{row.product.label}</div>
                <div>{row.quantity.label}</div>
              </div>
            ))}
          </div>
          <button onClick={handleTextToSpeech} className="bg-yellow-500 text-white px-4 py-2 rounded mt-4">
            What is my Order?
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
