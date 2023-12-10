import { useState } from "react";
import ReactDatePicker from "react-datepicker";

// css
import "/node_modules/react-datepicker/dist/react-datepicker.css";

const DataPicker = ({ placeholder }) => {
  const [startDate, setStartDate] = useState();

  return (
    <ReactDatePicker
      closeOnScroll={true}
      selected={startDate}
      placeholderText={placeholder}
      onChange={(date) => setStartDate(date)}
    />
  );
};

export default DataPicker;
