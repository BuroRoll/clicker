async function callClick() {
    let response = await fetch('http://localhost:8000/click/', {
        method: 'GET'
    });
    let answer = await response.json();
    document.getElementById("data").innerHTML = answer;
}

async function getUser(id) {
    let response = await fetch('http://localhost:8000/users/' + id, {
        method: 'GET'
    });
    let answer = await response.json();

    document.getElementById("user").innerHTML = answer['username'];
    let getCycle = await fetch('http://localhost:8000/cycles/' + answer['cycle'], {
        method: 'GET'
    });
    let cycle = await getCycle.json();
    document.getElementById("data").innerHTML = cycle['coinsCount'];
}

async function buyBoost(id) {
    let coins = BigInt(document.getElementById('data').innerHTML);
    console.log(coins);
    let boost_price = BigInt(document.getElementById('boost_price').innerHTML);
    console.log(boost_price);

    if (coins >= boost_price && coins >= 10) {
        console.log('BUY')
        let response = await fetch('http://localhost:8000/buyBoost/', {
            method: 'GET'
        });
        let answer = await response.json();
        document.getElementById("clickPower").innerHTML = answer;
        let response2 = await fetch('http://localhost:8000/cycles/' + id-1, {
            method: 'GET'
        });
        let answer2 = await response2.json()
        let coinsCounter = answer2['coinsCount']
        document.getElementById('data').innerHTML = coinsCounter;
        document.getElementById('boost_price').innerHTML = 20;
    }else{

    }
}
