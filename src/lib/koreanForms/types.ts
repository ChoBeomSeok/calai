// 정부 표준 PDF에 좌표 매핑하여 입력값을 그리기 위한 타입.
// 좌표는 PDF pt 단위 (1pt = 1/72인치), 원점은 페이지 좌하단 (PDF 표준).

export type FormFieldType = "text" | "checkbox" | "signature";

export type FormField = {
  /** 필드 식별자 (예: "landlord-name") */
  id: string;
  /** UI에 표시할 라벨 (예: "임대인 성명") */
  label: string;
  type: FormFieldType;
  /** 1-based 페이지 번호 */
  page: number;
  /** 좌측 하단 X (PDF pt) */
  x: number;
  /** 좌측 하단 Y (PDF pt). 텍스트 baseline 위치 */
  y: number;
  /** 가용 너비 (한 줄 자르기에 사용) */
  width: number;
  /** 가용 높이 (참고용) */
  height: number;
  /** 폰트 크기 (pt). 기본 10 */
  fontSize?: number;
  /** 정렬 방식. 기본 'left' */
  align?: "left" | "center" | "right";
  /** 멀티라인 (특약사항 등) */
  multiline?: boolean;
  /** 필수 입력 */
  required?: boolean;
  /** 입력 형식 힌트 (날짜·금액·전화 등) */
  format?: "text" | "date" | "money" | "phone" | "id4" | "area";
  /** 자리표시자 (UI에 보여줄 placeholder) */
  placeholder?: string;
  /** 메모 (개발자용) */
  notes?: string;
};

export type FormTemplate = {
  /** 양식 식별자 (예: "molit-rental-2020") */
  id: string;
  /** 양식 표시명 (예: "국토교통부 주택임대차표준계약서 (2020)") */
  name: string;
  /** 양식 출처 (예: "국토교통부 부동산거래관리시스템") */
  source: string;
  /** 양식 PDF 경로 (public/ 기준) */
  pdfPath: string;
  /** 총 페이지 수 */
  totalPages: number;
  /** 라이선스 (예: "공공누리 1유형") */
  license: string;
  /** 필드 목록 */
  fields: FormField[];
};

/** 필드 그룹 (UI 섹션 구성용) — 옵션 */
export type FormSection = {
  title: string;
  fieldIds: string[];
};
