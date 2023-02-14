

const database = require('../database/connection.js').database;

function train_to_db(intent, utterance, answer) {

    function encodeHTML(str) {
        return str.replace(/[<>&"'`!*,]/g, function (c) {
        return `&#${c.charCodeAt(0)};`;
    });
    }
    var intent = encodeHTML(intent);
    var utterance = encodeHTML(utterance);
    var answer = encodeHTML(answer);
    
    // Prepare the INSERT statement for the intent table
    const domain_id = 6; // Replace with the actual domain ID
     database.query(`SELECT * FROM intent where domain_id = ${domain_id} AND name = '${intent}' `, function (error, results , fields) {
        if (error) throw error;
        if (results.length > 0) {
            var intent_id = results[0].id;
            console.log(intent_id);
            save_trained(domain_id , intent_id , utterance , answer);

        }else{
           const intentQuery = "INSERT INTO intent (domain_id, name) VALUES (?, ?)";
            const name = intent;
            database.query(intentQuery, [domain_id, name], function(error, results, fields) {
                if (error) throw error;
                const intent_id = results.insertId;
                // Prepare the INSERT statement for the utterances table
                save_trained(domain_id , intent_id , utterance , answer);
            });
        }
    });

     function save_trained(domain_id , intent_id , utterance , answer) {
        const utteranceQuery = "INSERT INTO utterances (domain_id, intent_id, utterance) VALUES (?, ?, ?)";
        database.query(utteranceQuery, [domain_id, intent_id, utterance], function(error, results, fields) {
            if (error) throw error;
            return results;
        });
        const answerQuery = "INSERT INTO answers (domain_id, intent_id, answer) VALUES (?, ?, ?)";
        database.query(answerQuery, [domain_id, intent_id, answer], function(error, results, fields) {
            if (error) throw error;
            return results;
        });
    }
}



module.exports = train_to_db;
