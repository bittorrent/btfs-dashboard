import React, { useContext } from 'react';
import { mainContext } from 'reducer';
import FilesStats from 'components/Stats/FilesStats.js';
import Endpoint from 'components/Login/Endpoint.js';
import SetPassword from 'components/Login/SetPassword.js';
import PasswordLogin from 'components/Login/PasswordLogin.js';

export default function Files(props) {
    // const { state } = useContext(mainContext);
    // const { theme } = state;
    // const query = new URLSearchParams(props.location.search);
    // const bucketDetail = Number(query.get('bucketDetail'));
    // const bucketName = query.get('bucketName');
    // const accessKeyId = query.get('accessKeyId');
    // const secretAccessKey = query.get('secretAccessKey');

    return (
        <div className="flex">
            <div className="flex flex-1  justify-center items-center login-bg min-h-screen">
                <div className="flex justify-center items-center ">
                    <img src={require(`assets/img/login-img.png`).default} alt="" width={556} height={403} />
                </div>
            </div>
            <div className="flex flex-1 min-h-screen login-form  ">
                {
                    //<Endpoint />
                }
                {
                    // <SetPassword />
                }
                {
                    <PasswordLogin />
                }
            </div>
        </div>
    );
}
