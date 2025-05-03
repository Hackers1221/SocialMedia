import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { forwardRef } from "react";

// eslint-disable-next-line react/display-name
const Calendar = forwardRef(({value, onChange}, ref) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-white font-bold">Select Birthdate</label>
      <DatePicker
        selected={value}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        maxDate={new Date()}
        className={`text-white rounded-xl py-[0.6rem] px-4 block w-full focus:outline-none bg-[var(--input)]`}
        onKeyDown={(e) => e.preventDefault()}
        placeholderText="dd/mm/yyyy"
        ref={ref}
      />
   </div>
   );
});

export default Calendar;