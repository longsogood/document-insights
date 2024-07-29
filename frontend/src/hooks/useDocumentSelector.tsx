import { useState, useEffect, useRef } from "react";
import { GroupBase } from "react-select";
import Select from "react-select/dist/declarations/src/Select";
import { SecDocument, DocumentType, Ticker } from "~/types/document";
import type { SelectOption } from "~/types/selection";
import {
  findDocumentById,
  getAllTickers,
  sortDocuments,
  sortSelectOptions,
} from "~/utils/documents";
import {
  documentTypeOptions,
  getAvailableYears,
} from "~/utils/landing-page-selection";
import useLocalStorage from "./utils/useLocalStorage";
import { backendClient } from "~/api/backend";

export const MAX_NUMBER_OF_SELECTED_DOCUMENTS = 10;

export const useDocumentSelector = () => {
  // availableDocuments
  // State storage danh sách tất cả các documents có sẵn
  const [availableDocuments, setAvailableDocuments] = useState<SecDocument[]>(
    []
  );
  
  // availableTickers
  // State storage danh sách tất cả các tickers có sẵn
  const [availableTickers, setAvailableTickers] = useState<Ticker[]>([]);
  
  // availableDocumentTypes
  // Kiểu documents, sourced from documentTypeOptions
  const availableDocumentTypes = documentTypeOptions;
  
  // availableYears
  // State storage danh sách năm có sẵn cho tài liệu, có thể là danh sách SelectOption hoặc là null
  const [availableYears, setAvailableYears] = useState<SelectOption[] | null>(
    null
  );

  // sortedAvailableYears
  // Phiên bản được sắp xếp của availableYears
  const sortedAvailableYears = sortSelectOptions(availableYears);

  // set availableTickers dựa trên ds tất cả các documents có sẵn
  useEffect(() => {
    setAvailableTickers(getAllTickers(availableDocuments));
  }, [availableDocuments]);

  // Tìm và nạp ds tất cả các tài liệu từ backend
  useEffect(() => {
    async function getDocuments() {
      const docs = await backendClient.fetchDocuments();
      setAvailableDocuments(docs);
    }
    getDocuments().catch(() => console.error("could not fetch documents"));
  }, []);

  // selectedDocuments
  // State storage danh sách các tài liệu được người dùng chọn
  const [selectedDocuments, setSelectedDocuments] = useLocalStorage<
    SecDocument[]
  >("selectedDocuments", []);

  // sortedSelectedDocuments
  // Phiên bản được sắp xếp của selectedDocuments
  const sortedSelectedDocuments = sortDocuments(selectedDocuments);

  // selectedTicker
  // State cho ticker hiện được chọn
  const [selectedTicker, setSelectedTicker] = useState<Ticker | null>(null);

  // selectedDocumentType
  // Loại tài liệu được chọn, có thể là SelectionOption hoặc là null
  const [selectedDocumentType, setSelectedDocumentType] =
    useState<SelectOption | null>(null);

  // selectedYear & setSelectedYear
  // Năm được chọn, có thể là SelectOption hoặc là null
  const [selectedYear, setSelectedYear] = useState<SelectOption | null>(null);

  // handleAddDocument
  const handleAddDocument = () => {
    if (selectedTicker && selectedDocumentType && selectedYear) {
      setSelectedDocuments((prevDocs = []) => {
        if (prevDocs.find((doc) => doc.id === selectedYear.value)) {
          return prevDocs;
        }
        const newDoc = findDocumentById(selectedYear.value, availableDocuments);
        return newDoc ? [newDoc, ...prevDocs] : prevDocs;
      });
      setSelectedTicker(null);
      setSelectedDocumentType(null);
      setSelectedYear(null);
      setShouldFocusCompanySelect(true);
    }
  };

  // handleRemoveDocument
  const handleRemoveDocument = (documentIndex: number) => {
    setSelectedDocuments((prevDocs) =>
      prevDocs.filter((_, index) => index !== documentIndex)
    );
  };

  useEffect(() => {
    setSelectedDocumentType(null);
    setSelectedYear(null);
  }, [selectedTicker]);

  useEffect(() => {
    setSelectedYear(null);
  }, [selectedDocumentType]);

  useEffect(() => {
    if (selectedTicker && selectedDocumentType) {
      setAvailableYears(
        getAvailableYears(
          selectedTicker?.ticker,
          selectedDocumentType?.value as DocumentType,
          availableDocuments
        )
      );
    }
  }, [selectedTicker, selectedDocumentType, availableDocuments]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.key === "Enter" && event.shiftKey) ||
        (event.key === "Enter" && event.metaKey)
      ) {
        handleAddDocument();
      }
      if (event.key === "k" && event.metaKey) {
        setShouldFocusCompanySelect(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleAddDocument]);

  // isDocumentSelectionEnabled
  const isDocumentSelectionEnabled =
    selectedDocuments.length < MAX_NUMBER_OF_SELECTED_DOCUMENTS;

  // isStartConversationButtonEnabled
  const isStartConversationButtonEnabled = selectedDocuments.length > 0;

  // selectTicker
  const selectTicker = (ticker: Ticker) => {
    setSelectedTicker(ticker);
    setFocusDocumentType(true);
  };

  // selectDocumentType
  const selectDocumentType = (docType: SelectOption | null) => {
    setSelectedDocumentType(docType);
    setFocusYear(true);
  };

  // shouldFocusCompanySelect & setShouldFocusCompanySelect
  const [shouldFocusCompanySelect, setShouldFocusCompanySelect] =
    useState(false);

  const [focusYear, setFocusYear] = useState(false);
  const yearFocusRef = useRef<Select<
    SelectOption,
    false,
    GroupBase<SelectOption>
  > | null>(null);

  useEffect(() => {
    if (focusYear && yearFocusRef.current) {
      yearFocusRef.current?.focus();
      setFocusYear(false);
    }
  }, [focusYear]);

  const [focusDocumentType, setFocusDocumentType] = useState(false);
  const documentTypeFocusRef = useRef<Select<
    SelectOption,
    false,
    GroupBase<SelectOption>
  > | null>(null);

  useEffect(() => {
    if (focusDocumentType && documentTypeFocusRef.current) {
      documentTypeFocusRef.current?.focus();
      setFocusDocumentType(false);
    }
  }, [focusDocumentType]);

  return {
    availableDocuments,
    availableTickers,
    availableDocumentTypes,
    availableYears,
    sortedAvailableYears,
    selectedDocuments,
    sortedSelectedDocuments,
    selectedTicker,
    selectedDocumentType,
    selectedYear,
    setSelectedYear,
    handleAddDocument,
    handleRemoveDocument,
    isDocumentSelectionEnabled,
    isStartConversationButtonEnabled,
    yearFocusRef,
    documentTypeFocusRef,
    selectTicker,
    selectDocumentType,
    shouldFocusCompanySelect,
    setShouldFocusCompanySelect,
  };
};
