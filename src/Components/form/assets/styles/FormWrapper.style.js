import styled from 'styled-components';

const FormWrapperStyle = styled.div`
  .field-wrapper {
    min-height: 60px;
    .MuiFormControl-root {
      width: 100%;
      .MuiInputLabel-formControl {
        top: 4px;
        left: 11px;
        font-size: 14px;
      }
      .MuiInput-formControl {
        border: 1px solid #d5d5d5;
        border-radius: 5px;
      }
      .MuiInput-formControl:hover {
        border: 2px solid #01395e;
        border-radius: 5px;
      }
      .MuiInput-formControl:focus {
        border: 2px solid #01395e;
        border-radius: 5px;
      }
      .MuiInput-formControl:active {
        border: 2px solid #01395e;
        border-radius: 5px;
      }
      input {
        padding: 7px 11px 6px;
      }
      .Mui-error.MuiInput-formControl {
        border: 2px solid red;
        border-radius: 5px;
      }
        .MuiInput-error:before {
          border-bottom: none;
        }
        .MuiInput-error:hover:before {
          border-bottom: none;
        }
        .MuiInput-error:focus:before {
          border-bottom: none;
        }
        .MuiInput-error:after {
          border-bottom: none;
        }
        .MuiInput-error:hover:after {
          border-bottom: none;
        }
        .MuiInput-error:focus:after {
          border-bottom: none;
        }
        .MuiInputAdornment-positionEnd {
          color: #747474;
          margin-right: 13px;
          .MuiIconButton-root {
            padding: 0;
          }
        }
      }
    }
    .MuiInput-underline:before {
      border-bottom: none !important;
    }
    .MuiInput-underline:hover:before {
      border-bottom: none !important;
    }
    .MuiInput-underline:focus:before {
      border-bottom: none !important;
    }
    .MuiInput-underline:after {
      border-bottom: none !important;
    }
    .MuiInput-underline:hover:after {
      border-bottom: none !important;
    }
    .MuiInput-underline:focus:after {
      border-bottom: none !important;
    }
    .checkbox-group-wrapper {
      .MuiFormGroup-root {
        flex-direction: row;
        .MuiTypography-root {
          font-size: 12px;
        }
        .MuiFormControlLabel-root {
            width: 110px;
        }
      }
    }
    .MuiCheckbox-colorPrimary.Mui-checked {
      color: #01395e;
    }
    .MuiFormHelperText-root {
      font-size: 12px;
      margin-top: 0;
    }
  }
  .first-half {
    width: 48%;
    display: inline-block;
    margin-right: 2%;
  }
  .second-half {
    width: 48%;
    margin-left: 2%;
    display: inline-block;
  }
  .double-button {
    display: flex;
    justify-content: space-between;
    .submit-button {
      color: white;
      background-color: #01395E;
      width: 47%;
      height: 34px;
      border-radius: 5px;
      font-family: Arial;
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
      line-height: 140%;
    }
    .cancel-button {
      color: #01395E;
      box-shadow: 0 1px 20px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      margin-top:20px;
      height: 34px;
      width: 47%;
      border: solid 1px #01395E;
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
      line-height: 140%;
    }
  }
    .submit-button {
      color: white;
      margin: 20px 0 30px;
      background-color: #01395E;
      width: 100%;
      height: 34px;
      border-radius: 5px;
      font-family: Arial;
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
      line-height: 140%;
    }
    .submit-button:hover {
      color: #01395E;
      background-color: white;
    }
  .ts {
    margin-top: 15px;
    .MuiFormLabel-root {
      color: #01395e;
      margin-left: 10px;
    }
  }
  .agreement {
    min-height: 10px;
    display: flex;
    a {
      margin-left: 5px;
      font-family: 'arial';
      font-style: italic;
      font-weight: bold;
      font-size: 12px;
      line-height: 140%;
      display: flex;
      align-items: center;
      text-decoration-line: underline;
      color: #01395E;
    }
    span {
      font-family: 'arial';
      font-weight: bold;
      font-size: 12px;
      line-height: 140%;
      display: flex;
      align-items: center;
      color: black;
    }
  }

  @media (max-width: 500px){
    .first-half {
      width: 100%;
      margin-right: 0;
    }
    .second-half {
      width: 100%;
      margin-left: 0;
    }
    }
`;

export default FormWrapperStyle;
