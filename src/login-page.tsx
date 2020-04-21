import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Route, withAuthCallback } from 'infrastructure-components';

const LoginPage = withAuthCallback(({authCallback, ...props}) => {
    const history = useHistory();
    const [credentials, setCredentials] = useState({email: "", password: ""});
    return <div>
        <input
            value={credentials.email}
            type="text"
            placeholder='Please enter your e-mail address'
            onChange={event => setCredentials({email: event.target.value, password: credentials.password})}
        />
        <input
            value={credentials.password}
            type="password"
            placeholder='enter your password'
            onChange={event => setCredentials({email: credentials.email, password: event.target.value})}
        />
        <button
            disabled={ !(/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/.test(credentials.email)) }
            onClick={()=> authCallback(
                credentials.email, credentials.password, "/", err => console.log("error: ", err)
            )}
        >Login</button>
    </div>
});

export default function (props) {
    return <Route path='/login' name='Login' render={() => <LoginPage />}/>
};