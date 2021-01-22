const axios = require('axios');

(async() => {
    try {
        const { data } = await axios.post('http://localhost:3000/auth/register', {
            username: 'seller',
            password: 'password',
            seller: true
        });
        //console.log('Login Data', data);

        //const { token, id } = data;

        // const headers = {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${token}`
        // }
        //
        // const { data: res2 } = await axios.post('http://localhost:3000/product', {
        //     title: 'new Phone2',
        //     description: 'description',
        //     price: '399.99'
        //
        // }, {headers: headers});

        //Delete
        // const { data: res2 } = await axios.delete('http://localhost:3000/product/60086db9ffb03244d12caf40', {headers: headers},
        //    );

        //Update
        // const { data: res2 } = await axios.put('http://localhost:3000/product/600865fba90c0c306d2b4bd2',
        //   {
        //     title: 'new Phone9'
        //
        // }, {headers: headers});

        //get Data All
        // const { data: res2 } = await axios.get(`http://localhost:3000/product`, {
        //     //     title: 'new Phone',
        //     //     description: 'description',
        //     //     price: '399.99'
        //     //
        //     // },
        //     headers: headers});

        //console.log(res2);
    } catch (err) {
        console.log('Error ', err);
    }

})();