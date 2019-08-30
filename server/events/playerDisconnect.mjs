import * as alt from 'alt';
import * as registrationLogin from '../registration/login.mjs';
import * as systemsJob from '../systems/job.mjs';

console.log('Loaded: events->playerDisconnect.mjs');

alt.on('playerDisconnect', player => {
    // If the player isn't logged in; don't do anything else.
    if (player.guid === undefined) {
        alt.log(`${player.name} has disconnected.`);
        return;
    }

    // Check if the player has character data.
    if (player.data === undefined) {
        alt.log(`${player.name} has disconnected.`);
        return;
    }

    // Has character data at this point.
    clearTimeout(player.reviveTimeout);
    clearTimeout(player.loginHealth);

    // Clear Job Data
    if (player.jobOwner !== undefined && player.inJobVehicle) {
        systemsJob.exitFee(player, player.jobOwner);
    }

    systemsJob.cancelJob(player);

    // Save players last location dependent on what they're doing.
    if (player.lastLocation !== undefined) {
        player.data.lastposition = JSON.stringify(player.lastLocation);
    } else {
        player.data.lastposition = JSON.stringify(player.pos);
    }

    player.data.health = player.health;

    // Save the data.
    player.save();
    alt.log(`${player.name} has disconnected.`);

    // Remove the logged in user.
    registrationLogin.removeLoggedInPlayer(player.username);
});
