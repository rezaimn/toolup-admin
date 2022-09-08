import styled from 'styled-components';

const AuthWrapperStyle = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f6f6f6;
    justify-content: start;
    .logo-wrapper {
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
        height: 200px;
        span {
            width: 114px;
            margin-left: 10px;
            height: 25px;
            left: 708px;
            top: 92px;
            font-family: Arial Black;
            font-style: normal;
            font-weight: 900;
            font-size: 30px;
            line-height: 140%;
            display: flex;
            align-items: center;
            color: #212121;
        }
    }
    .tab-wrapper {
        width: 485px;
        top: 206px;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        margin: 0 auto;
        margin-bottom: 116px;
        background: #ffffff;
        box-shadow: 0 1px 20px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        #simple-tabpanel-1 {
            width: 100%;
        }
        .MuiAppBar-colorPrimary {
            color: #01395e;
            background-color: #ffffff;
            font-family: Arial;
            font-style: normal;
            font-weight: regular;
            font-size: 24px;
            line-height: 140%;
            text-align: center;
            .MuiTab-wrapper {
                font-size: 24px;
            }
            .Mui-selected {
                font-weight: bold;
            }
            .MuiTabs-root {
                .MuiTabs-scroller {
                    .MuiTabs-indicator {
                        background-color: #01395e;
                        height: 2px;
                        width: 90px !important;
                        margin: 0 35px;
                    }
                }
            }
        }
        .MuiPaper-root {
            margin: 30px auto 0;
            display: flex;
            align-items: center;
        }
        .MuiPaper-elevation4 {
            box-shadow: none;
        }
        .MuiBox-root {
            padding: 10px 70px;
        }
    }
    .success {
        .success-message {
            font-family: Arial;
            font-style: normal;
            font-weight: bold;
            font-size: 24px;
            line-height: 140%;
            text-align: center;
            color: #73cd53;
            margin: 22px 0;
        }
        .success-detail {
            font-family: Arial;
            font-style: normal;
            font-weight: bold;
            font-size: 18px;
            line-height: 140%;
            text-align: center;
            color: #747474;
            width: 380px;
        }
        .success-button {
            color: white;
            background-color: #01395e;
            width: 169px;
            height: 34px;
            border-radius: 5px;
            font-family: Arial;
            font-style: normal;
            font-weight: bold;
            font-size: 14px;
            line-height: 140%;
            margin: 116px 0 62px;
        }
    }
    .forgot-password {
        display: flex;
        align-items: center;
        .form {
            padding: 50px 30px;
            width: 100%;
        }
        .forgot-password-title {
            font-family: Arial;
            font-style: normal;
            font-weight: bold;
            font-size: 24px;
            line-height: 140%;
            text-align: center;
            color: #01395e;
            margin: 22px 0;
        }
        .forgot-password-detail {
            font-family: Arial;
            font-style: normal;
            font-weight: regular;
            font-size: 14px;
            line-height: 140%;
            text-align: center;
            color: #747474;
            width: 240px;
        }
        .link {
            border: none;
            box-shadow: none;
            font-family: Arial;
            font-style: italic;
            font-weight: bold;
            font-size: 12px;
            line-height: 140%;
            text-align: center;
            text-decoration-line: underline;
            color: #01395e;
            cursor: pointer;
            text-transform: none;
        }
        .link:hover {
            background-color: white;
        }
    }
    .complete-register {
        display: flex;
        align-items: center;
        .form {
            padding: 0 30px;
            width: 100%;
        }
        .title {
            font-family: Arial;
            font-style: normal;
            font-weight: bold;
            font-size: 24px;
            line-height: 140%;
            text-align: center;
            color: #01395e;
            margin: 22px 0 0;
        }
    }
    .extra-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-content: center;
        .MuiFormControlLabel-label {
            font-size: 12px;
        }
        .link {
            font-family: Arial;
            font-style: italic;
            font-weight: bold;
            font-size: 12px;
            line-height: 140%;
            text-align: right;
            text-decoration-line: underline;
            color: #01395e;
            cursor: pointer;
        }
    }
    button:focus {
        outline: none;
    }
    @media (max-width: 500px) {
        .tab-wrapper {
            width: 90%;

            .MuiAppBar-colorPrimary {
                .MuiTab-wrapper {
                    font-size: 20px;
                }
                .MuiTabs-root {
                    .MuiTabs-scroller {
                        .MuiTabs-indicator {
                            margin: 0 35px 0 10px;
                        }
                    }
                }
            }
            .MuiBox-root {
                padding: 10px 20px;
            }
        }
    }
`;

export default AuthWrapperStyle;
