/* 
 * TODO: look into adding the model part of MVP
 *
 */
const db = require('./db');

exports.getAll = ( cb ) => {
    
    db.connection.query('SELECT name, id FROM activity', (err, rows) => { if (err) throw err; cb(rows); });
};

exports.getPosts = (activityName, cb) => {

    db.connection.query(`SELECT post.id, post.name, post.body FROM post 
        JOIN activity ON activity.id = post.activity WHERE activity.name = ?`, activityName,
    (err, rows) => { if (err) throw err; cb(rows) });
};


// Returns extended activities (activity + total users + total posts) for all activities
exports.getExtendedAll = ( cb ) => {

    // console.log("getting extended post info")


    db.connection.query(`SELECT activity.* ,info.userCount, info.postCount 
    FROM activity JOIN (select users.id ,users.userCount, posts.postCount FROM (SELECT activity.id , COUNT(participation.activity) AS userCount FROM activity LEFT JOIN participation ON participation.activity = activity.id GROUP BY activity.id) AS users JOIN (SELECT activity.id , COUNT(post.activity) AS postCount FROM activity LEFT JOIN post ON post.activity = activity.id GROUP BY activity.id) AS posts ON users.id = posts.id) AS info 
        ON activity.id = info.id`,
    (err, rows) => { if (err) throw err; cb(rows); });

};

exports.getExtendedPosts = (activityName, cb) => {

    // maybe later return creatorname and say time of posting?
    db.connection.query(`SELECT post.id, post.name , post.body, post.commentCount FROM (SELECT post.*, count(comment.post) AS commentCount FROM post LEFT JOIN comment on post.id = comment.post GROUP BY post.id) as post JOIN activity ON activity.id = 
    post.activity WHERE activity.name = ?`, activityName,
    (err, rows) => { if (err) throw err; cb(rows) });
};

// do we need async?
exports.createActivity = async (activityName, description, cb) => {

    // console.log(activityName, description);

    // Checking Here
    let uniqueName = false;
    const result =  await db.query(`SELECT * FROM activity WHERE activity.name = ?`, activityName);

    // console.log("result",result);


    // check if there are any activities with same name
    if (result.length==0){
        uniqueName = true;
    }
    else{
        uniqueName = false;
    } 
    // console.log("check is ",uniqueName);

    // Try to insert data if it passes constraint
    if (uniqueName){
        let temp = await db.query(`INSERT INTO activity(name,description) VALUES(?, ?)`, [activityName, description]);
        // console.log(temp);
    }
    else{
        // console.log("NAME NOT UNIQUE");
        throw Error("I AM DISAPPOINTED IN YOU MY CHILD");
    }



    
    // console.log(`INSERT INTO activity(name,description) VALUES(?, ?)`, [activityName, description]);

    // db.query(`INSERT INTO activity(name,description) VALUES(?, ?)`, [activityName, description]);

};


exports.createPost = async (postName, postBody, postActivity, postCreator, postCreationTime, cb) => {

    // get id's for creator and activity

    const Activity = await db.queryOne(`SELECT activity.id from activity where activity.name = ?`, postActivity);


    // dont forget the .id because it is a row data packet
    console.log("will insert:",postName, postBody, Activity.id,postCreator, postCreationTime);

    // check if it passed constraints

    // WHAT ARE THE CONSTRAINTS FOR POST?
    // IF user is in activity?


    // try to insert data if it passes constraint

    let temp = await db.query(`INSERT INTO post(name, body, activity, creator, creation_time) VALUES(?, ?, ?, ?, ?)`, [postName, postBody, Activity.id, postCreator, postCreationTime]);

};