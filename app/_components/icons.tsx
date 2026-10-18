// 화면에 쓰는 아이콘 모음: 뒤로 화살표 · 로고 · 완료 마크 · 체크 표시 (색은 토큰 클래스로)
export function ArrowLeftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-24 shrink-0">
      <path
        className="fill-icon-default"
        d="M13.293 6.29304C13.6836 5.90252 14.3166 5.90252 14.7071 6.29304C15.0976 6.68357 15.0976 7.31661 14.7071 7.70711L10.4141 12.0001L14.7071 16.293C15.0976 16.6836 15.0976 17.3166 14.7071 17.7071C14.3166 18.0976 13.6836 18.0976 13.293 17.7071L8.29304 12.7071C7.90252 12.3166 7.90252 11.6836 8.29304 11.293L13.293 6.29304Z"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none" role="img" aria-label="U+" className="shrink-0">
      <path
        className="fill-brand-primary"
        d="M5.54199 12.5547C5.54166 13.7004 5.50367 14.7802 6.38965 15.6611C7.54866 16.8131 9.88416 16.814 11.042 15.6582C11.9039 14.7977 11.8804 13.7822 11.8799 12.6582L11.8789 3.90137H15.4219L15.4238 11.0127C15.424 11.9247 15.4618 12.8892 15.3936 13.7842C15.0996 17.6333 12.5288 19.7406 8.72754 19.7236C5.50665 19.7094 3.02052 18.3211 2.22949 15.0352C2.03974 14.2467 2.00522 13.5669 2 12.8311V3.90137H5.54297L5.54199 12.5547Z"
      />
      <path
        className="fill-brand-primary"
        d="M24.8838 8.41797C26.3376 8.40309 27.8164 8.41671 29.2725 8.41797V11.3809L24.8828 11.3799C24.8698 12.6311 24.8926 13.8862 24.8828 15.1377C24.882 15.25 24.9005 15.711 24.8564 15.7676H21.835C21.8245 15.2878 21.8332 14.7705 21.833 14.2881V11.3809H17.4092V8.41699L21.833 8.41797L21.832 3.90137H24.8818L24.8838 8.41797Z"
      />
    </svg>
  );
}

const CHECK_PATH =
  "M22.6013 8.22632C23.2359 7.59172 24.2641 7.59172 24.8987 8.22632C25.5333 8.86092 25.5333 9.88908 24.8987 10.5237L13.0237 22.3987C12.3891 23.0333 11.3609 23.0333 10.7263 22.3987L5.10132 16.7737C4.46672 16.1391 4.46672 15.1109 5.10132 14.4763C5.73592 13.8417 6.76408 13.8417 7.39868 14.4763L11.875 18.9526L22.6013 8.22632Z";

export function DoneMark() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true" className="size-64 shrink-0">
      <circle cx="32" cy="32" r="32" className="fill-fill-primary" />
      <path transform="translate(17 17)" className="fill-icon-on-dark" d={CHECK_PATH} />
    </svg>
  );
}

export function CheckMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 30 30" fill="none" aria-hidden="true" className="size-24">
      <path className="fill-icon-on-dark" d={CHECK_PATH} />
    </svg>
  );
}
