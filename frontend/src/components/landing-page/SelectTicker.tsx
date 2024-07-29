import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import type { Ticker } from "~/types/document";
import { useCombobox } from "downshift"; // tạo chức năng combobox
import cx from "classnames"; // extension để áp dụng các lớp điều kiện
import { HiOutlineBuildingOffice2 } from "react-icons/hi2"; // 
import useFocus from "~/hooks/utils/useFocus"; // custom hook để quản lý tiêu điểm (focus) của input


// hàm phụ trợ: hàm lọc ticker dựa trên giá trị đầu vào, kiểm tra xem tên đầy đủ hoặc ký hiệu của ticker có chứa input value không
function getTickerFilter(inputValue: string) {
  const lowerCasedInputValue = inputValue.toLowerCase();

  return function tickerFilter(ticker: Ticker) {
    return (
      !inputValue ||
      ticker.fullName.toLowerCase().includes(lowerCasedInputValue) ||
      ticker.ticker.toLowerCase().includes(lowerCasedInputValue)
    );
  };
}

// định nghĩa các thuộc tính (props) của component
interface DocumentSelectComboboxProps {
  selectedItem: Ticker | null; // ticker được chọn
  setSelectedItem: (ticker: Ticker) => void;  // hàm set ticker được chọn
  availableDocuments: Ticker[]; // ds tất cả các tickers có sẵn
  shouldFocusTicker: boolean; // boolean cho biết có nên set focus vào input hay không
  setFocusState: Dispatch<SetStateAction<boolean>>; // quản lý focus state
}

// định nghĩa component: component function nhận vào các props dựa trên DocumentSelectComboboxProps 
export const DocumentSelectCombobox: React.FC<DocumentSelectComboboxProps> = ({
  selectedItem, 
  availableDocuments,
  setSelectedItem,
  shouldFocusTicker,
  setFocusState,
}) => {
  const [focusRef, setFocus] = useFocus<HTMLInputElement>(); // useFocus: custom hook, được sử dụng để quản lý focus state của input
                                                             // trả về một mảng với hai giá trị [focusRef: tham chiếu đến phần tử của input,
                                                                                              // setFocus: đặt focus vào phân tử input] 
  useEffect(() => {
    if (shouldFocusTicker) {
      setInputValue("");
      setFocus();
      setFocusState(false);
    }
  }, [shouldFocusTicker]);

  const [filteredDocuments, setFilteredDocuments] = // danh sách các documents được lọc
    useState<Ticker[]>(availableDocuments);

  useEffect(() => {
    setFilteredDocuments(availableDocuments);
  }, [availableDocuments]);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    setInputValue,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      if (inputValue) {
        setFilteredDocuments(
          availableDocuments.filter(getTickerFilter(inputValue))
        );
      } else {
        setFilteredDocuments(availableDocuments);
      }
    },
    items: filteredDocuments,
    itemToString(item) {
      return item ? item.ticker : "";
    },
    selectedItem,
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      if (newSelectedItem) {
        setSelectedItem(newSelectedItem);
      }
    },
  });
  return (
    <div className="flex-grow">
      <div className="flex flex-col gap-1 rounded-s bg-[#F7F7F7]">
        <div className="flex items-center justify-center gap-0.5 shadow-sm">
          <div className="ml-2">
            <HiOutlineBuildingOffice2 size={20} />
          </div>
          <input
            placeholder="Search by company ticker or name"
            className="align-center mt-[5px] w-full p-1.5 focus:outline-none "
            {...getInputProps({ ref: focusRef })}
            style={{ backgroundColor: "#F7F7F7" }}
          />
        </div>
      </div>
      <ul
        className={`absolute z-20 mt-1 max-h-72 w-72 overflow-scroll bg-white p-0 shadow-md ${
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          !(isOpen && filteredDocuments.length) && "hidden"
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          filteredDocuments.map((item, index) => (
            <li
              className={cx(
                highlightedIndex === index && "bg-[#818BE7] text-white",
                selectedItem === item && "font-bold",
                "z-20 flex flex-col px-3 py-2 shadow-sm"
              )}
              key={`${item.fullName}${index}`}
              {...getItemProps({ item, index })}
            >
              <span>{item.fullName}</span>
              <span className="text-sm ">{item.ticker}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};
