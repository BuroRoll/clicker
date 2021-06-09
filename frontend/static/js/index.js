async function callClick() {
    let coins = BigInt(document.getElementById('data').innerText)
    let click_power = BigInt(document.getElementById('clickPower').innerText)
    coins += click_power
    document.getElementById("data").innerHTML = coins
    check_boosts()
}

function check_boosts() {
    let coins = BigInt(document.getElementById('data').innerHTML)
    let boost = document.getElementById('boost-wrapper')
    for (const boostElement of boost.children) {
        let boostPrice = BigInt(boostElement.children[1].children[0].children[1].children[0].innerHTML)
        if (coins < boostPrice)
            boostElement.classList.add("disabledbutton")
        else
            boostElement.classList.remove("disabledbutton")
    }
}

async function getUser(id) {
    let response = await fetch('/users/' + id, {
        method: 'GET'
    });
    let answer = await response.json();

    document.getElementById("user").innerHTML = answer['username'];
    let getCycle = await fetch('/cycles/' + answer['cycle'], {
        method: 'GET'
    });
    let cycle = await getCycle.json();
    document.getElementById("data").innerHTML = cycle['coinsCount'];
    document.getElementById("clickPower").innerHTML = cycle['clickPower'];
    let boost_request = await fetch('/boosts/' + answer.cycle, {
        method: 'GET'
    })
    let boosts = await boost_request.json()
    render_all_boosts(boosts)
    check_boosts()
    set_auto_click()
    set_send_coins_interval()

}


function buyBoost(boost_level) {
    let boost_price = Number.MAX_VALUE;
    let coins = BigInt(document.getElementById('data').innerHTML)
    let boost = document.getElementById('boostPrice_' + boost_level)
    if (boost !== null)
        boost_price = BigInt(boost.innerHTML)
    else
        boost_price = 10

    if (coins >= boost_price) {
        const csrftoken = getCookie('csrftoken')
        fetch('/buyBoost/', {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrftoken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                boost_level: boost_level
            })
        }).then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return Promise.reject(response)
            }
        }).then(data => {
            console.log(data['boost_type'])
            if (data['boost_type'] === 1) {
                let c_lvl = 'boostLevel_' + data['level']
                let c_power = 'boostPower_' + data['level']
                let c_price = 'boostPrice_' + data['level']
                document.getElementById(c_power).innerHTML = data['power'];
                document.getElementById(c_lvl).innerHTML = data['level'];
                document.getElementById(c_price).innerHTML = data['price'];
            } else {
                document.getElementById("autoClickPower").innerHTML = data['autoClickPower'];
            }
            document.getElementById("data").innerHTML = data['coinsCount'];
            document.getElementById("clickPower").innerHTML = data['clickPower'];

        })
    }
    check_boosts()
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function render_all_boosts(boosts) {
    let parent = document.getElementById('boost-wrapper')

    if (parent.children.length > 1) {
        parent.innerHTML = ''
    }

    boosts.forEach(boost => {
        render_boost(parent, boost)
    })
    if (parent.children.length > 1) {
        let b = document.getElementById('boost-holder')
        b.remove()
    }
}

function render_boost(parent, boost) {
    console.log(boost);
    const div = document.createElement('div')
    div.setAttribute('class', 'boost-holder')
    div.setAttribute('id', `boost-holder-${boost.level}`)
    console.log(boost.boost_type)
    if (boost.boost_type === 1) {
        div.innerHTML = `
                <div class="item-1">
                    <input id="buy_img" type="image" style="height: 145px; width: 150px; border-radius: 20px" src="https://pbs.twimg.com/profile_images/1384292719284027397/MOw0AJrZ_400x400.png"
                           "/>
                </div>
                <div class="item-2">
                    <div class="box-1">
                       <div>Сила буста
                            <div id="boostPower_${boost.level}">${boost.power}</div>
                       </div>
                        <div>Цена буста
                            <div id="boostPrice_${boost.level}">${boost.price}</div>
                       </div>
                    </div>
                    <div class="box-2">
                        <div>Уровень буста<div id="boostLevel_${boost.level}">${boost.level}</div></div>
                    </div>
                </div>
  `
    } else {
        div.innerHTML = `
                <div class="item-1">
                    <input id="buy_img" class="buy_img" type="image" style="height: 145px; width: 150px;" src="https://sun9-75.userapi.com/impg/rPuPUzssw98rfyBRLhyAjE-Gj_097EiPk_v32g/nA3VlL9zI1Y.jpg?size=1172x1172&quality=96&sign=0704a49cb667f2bbf3a2d83969c1efc3&type=album"
                           "/>
                </div>
                <div class="item-2">
                    <div class="box-1">
                       <div>Сила буста
                            <div id="boostPower_${boost.level}">I am Автобуст (∞)</div>
                       </div>
                        <div>Цена буста
                            <div id="boostPrice_${boost.level}">${boost.price}</div>
                       </div>
                    </div>
                    <div class="box-2">
                        <div>Уровень буста<div id="boostLevel_${boost.level}">${boost.level}</div></div>
                    </div>
                </div>
  `
    }
    div.onclick = function () {
        buyBoost(boost.level)
    }
    parent.appendChild(div)
}


function set_auto_click() {
    setInterval(function () {
        const coins_counter = document.getElementById('data')
        let coins_value = parseInt(coins_counter.innerText)

        const auto_click_power = document.getElementById('autoClickPower').innerText
        coins_value += parseInt(auto_click_power)
        document.getElementById("data").innerHTML = coins_value;
    }, 1000)
}

function set_send_coins_interval() {
    setInterval(function () {
        const csrftoken = getCookie('csrftoken')
        const coins_counter = document.getElementById('data').innerText

        fetch('/set_maincycle/', {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrftoken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                coinsCount: coins_counter,
            })
        }).then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return Promise.reject(response)
            }
        }).then(data => {
            if (data.boosts)
                render_all_boosts(data.boosts)
            check_boosts()
        }).catch(err => console.log(err))
    }, 10000)
}