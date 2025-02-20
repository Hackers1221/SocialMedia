import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { forwardRef } from "react";

// eslint-disable-next-line react/display-name
const Calendar = forwardRef(({value, onChange}, ref) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-700 font-medium">Select Birthdate</label>
      <DatePicker
        selected={value}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        maxDate={new Date()}
        className={`border border-[2px] rounded-lg px-3 py-2 w-full focus:outline-none`}
        style={{
          // borderColor: _COLOR.light,
          backgroundColor: _COLOR.lightest,
        }}
        onKeyDown={(e) => e.preventDefault()}
        placeholderText="dd/mm/yyyy"
        ref={ref}
      />
   </div>
   );
});

export default Calendar;