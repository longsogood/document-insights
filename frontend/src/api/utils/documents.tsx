import { MAX_NUMBER_OF_SELECTED_DOCUMENTS } from "~/hooks/useDocumentSelector";
import { BackendDocument, BackendDocumentType } from "~/types/backend/document";
import { SecDocument, DocumentType } from "~/types/document";
import { documentColors } from "~/utils/colors";
import _ from "lodash";


// BackendDocument {
//   created_at: string;
//   id: string;
//   updated_at: string;
//   metadata_map: BackendMetadataMap;
//   url: string;

// SecDocument {
//   ticker: string;
//   fullName: string;
//   id: string;
//   url: string;
//   year: string;
//   docType: DocumentType;
//   quarter?: string;
//   color: DocumentColorEnum;
// }

export const fromBackendDocumentToFrontend = (
  backendDocuments: BackendDocument[]
) => {
  // sort by created_at so that de-dupe filter later keeps oldest duplicate docs
  backendDocuments = _.sortBy(backendDocuments, 'created_at'); // sort document backend
  let emptyMetadataCount = 0;
  let frontendDocs: SecDocument[] = backendDocuments.slice().reverse().map((backendDoc, index) => {
    const backendDocType = backendDoc.metadata_map?.sec_document?.doc_type;
    const frontendDocType =
      backendDocType === BackendDocumentType.TenK
        ? DocumentType.TenK
        : backendDocType === BackendDocumentType.TenQ
        ? DocumentType.TenQ
        : DocumentType.Custom;

    console.log(index,frontendDocType);
    // we have 10 colors for 10 documents
    const colorIndex = index < 10 ? index : 0;

    if (!backendDoc.metadata_map?.sec_document || Object.keys(backendDoc.metadata_map.sec_document).length === 0) {
      emptyMetadataCount++;
      // const ticker = backendDoc.metadata_map?.sec_document?.company_ticker || "CSTM"+String(1);
      // const fullName = backendDoc.metadata_map?.sec_document?.company_name || "CustomFile"+String(1);
      // const year = String(backendDoc.metadata_map?.sec_document?.year) || "None";
      // const quarter = backendDoc.metadata_map.sec_document.quarter || "None";
      // console.log(ticker, fullName, year, quarter)
    }
    let customIndex = emptyMetadataCount.toString();
    console.log("complele index ", index)
    return {
      id: backendDoc.id,
      url: backendDoc.url,
      ticker: backendDoc.metadata_map?.sec_document?.company_ticker || "CSTM"+customIndex,
      fullName: backendDoc.metadata_map?.sec_document?.company_name || "CustomFile"+customIndex,
      year: String(backendDoc.metadata_map?.sec_document?.year) || "None",
      docType: frontendDocType,
      color: documentColors[colorIndex],
      quarter: backendDoc.metadata_map?.sec_document?.quarter || "None",
    } as SecDocument;
  });
  console.log("Done!")
  // de-dupe hotfix
  const getDocDeDupeKey = (doc: SecDocument) => `${doc.ticker}-${doc.year}-${doc.quarter || ''}`;
  frontendDocs = _.chain(frontendDocs).sortBy(getDocDeDupeKey).sortedUniqBy(getDocDeDupeKey).value();

  return frontendDocs;
};
