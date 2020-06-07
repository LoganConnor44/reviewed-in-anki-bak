import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import GetAppIcon from '@material-ui/icons/GetApp';
import AddToHomescreenPrompt from './AddToHomeScreenPrompt';

/**
 * React web component to install the WebApk or a web shortcut to the user's homescreen.
 */
const InstallPwa = ({database}) => {
    const [prompt, promptToInstall] = AddToHomescreenPrompt(database);
    const [isAddToHomescreenVisible, setIsAddToHomescreenVisible] = useState(false);
    const [promptUserForInstallation, setPromptUserForInstallation] = useState(false);

    const dismissAndStorePreference = event => {
        hideAddToHomescreen();
        doNotPromptAgain(event);
    };

    const hideAddToHomescreen = () => setIsAddToHomescreenVisible(false);

    const installAndHideMessage = () => {
        hideAddToHomescreen();
        promptToInstall();
    };

    const doNotPromptAgain = event => {
        event.preventDefault();
        database.preferences.toArray().then(results => {
            database.preferences.update(results[0].id, {promptUserForInstallation: false});
        });
    };
    
    database.preferences.toArray().then(results => {
        if (results.length !== 0) {
            setPromptUserForInstallation(results[0].promptUserForInstallation);
        }
    });
    
    useEffect(() => {
        /**
         * Determines if the prompt is false or anything else.
         * Prompt may be an object such as { isTrusted: boolean }
         */
        const promptEventIsReady = () => prompt !== false ? prompt : false;
        console.log(`inThe effect use`);

        if (promptEventIsReady() && promptUserForInstallation) {
            console.log(`in`);
            setIsAddToHomescreenVisible(true);
        }
    }, [prompt, promptUserForInstallation]);

    const message = "Click here to download this app.";

    return ( 
        isAddToHomescreenVisible ?
            <Snackbar anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                    
                }}
                open={isAddToHomescreenVisible}
                autoHideDuration={3000} >
                <SnackbarContent message={
                    <div style={{
                            display: 'flex',
                            alignItems: 'center'
                        }} >
                        <InfoIcon style={{marginRight: 4}} />
                    {message}
                    </div>
                    }
                    style={{backgroundColor: '#43a047'}}
                    action={
                        <div>
                            <IconButton key="download-and-dismiss" aria-label="download-and-dismiss" onClick={installAndHideMessage} >
                                <GetAppIcon />
                            </IconButton>
                            <IconButton key="close" aria-label="close" onClick={dismissAndStorePreference} >
                                <CloseIcon />
                            </IconButton>
                        </div>
                    } />
            </Snackbar>
            :
            <div></div>
    );
};

export default InstallPwa;