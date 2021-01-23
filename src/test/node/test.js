async function retryRequest(promiseFunc, nrOfRetries) {
    // Write your code here
    return new Promise((resolve, reject) => {

        let executedTries = 0
        let makeTry = () => {

            promiseFunc().then( (res) => {

                resolve(res);
            }, () => {
                executedTries++
                if (executedTries >= nrOfRetries)
                {
                    reject('FAIL')
                }
                else
                {
                    makeTry();
                }
            })
        };
        makeTry();
    })
}

let hasFailed = false;
function getUserData() {
    return new Promise((resolve, reject) => {
        if(!hasFailed) {
            hasFailed = true;
            reject("Exception!");
        } else {
            resolve("Fetched user!");
        }
    });
}
let promise = retryRequest(getUserData, 3);
if(promise) {
    promise.then((result) => console.log(result))
        .catch((error) => console.log("Error!"));
}
module.exports.retryRequest = retryRequest;