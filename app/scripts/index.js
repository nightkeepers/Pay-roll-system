// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import payRollArtifact from '../../build/contracts/Payroll.json'
console.log(payRollArtifact)

// MetaCoin is our usable abstraction, which we'll use through the code below.

const PayRoll = contract(payRollArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

const App = {
  start: async function () {
    const self = this
    //delete window.web3
    //window.web3.setProvider(new web3.providers.HttpProvider('http://127.0.0.1:8545'));
    // Bootstrap the MetaCoin abstraction for Use.
    PayRoll.setProvider(web3.currentProvider)
    //PayRoll.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))
    /*var abi =[{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":false,"inputs":[{"name":"ID","type":"address"},{"name":"salary","type":"uint256"},{"name":"bonus","type":"uint256"}],"name":"addEmployee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ID","type":"address"}],"name":"removeEmployee","outputs":[{"name":"salary2","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ID","type":"address"},{"name":"sal","type":"uint256"}],"name":"updateEmployee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ID","type":"address"},{"name":"bonus","type":"uint256"}],"name":"addBonus","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ID","type":"address"}],"name":"getEmployee","outputs":[{"name":"salary","type":"uint256"},{"name":"past","type":"uint256"},{"name":"bonus","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getTotalemployee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"addFund","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"calculateSalary","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"isFundEnough","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getPaid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getBonus","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
    var address = "0xf25186b5081ff5ce73482ad761db0eb0d25abfbf"
    var test = web3.eth.contract(abi).at(address);
    console.log(test.getTotalemployee.call({ from: account }))*/
    // Get the initial account balance so it can be displayed.
    await web3.eth.getAccounts(function (err, acc) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (acc.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      //accounts = accs
      account = acc[0]
      console.log(acc[0])
      const balanceElement = document.getElementById('totalemployees')
      balanceElement.innerHTML = PayRoll
      self.getTotalemployee()
      self.getBalance()
      self.computeFund()
      //self.refreshBalance()

    })

  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  /*refreshBalance: function () {
    const self = this

    let Payr
    PayRoll.deployed().then(function (instance) {
      Payr = instance
      return Payr.getBalance.call(account, { from: account })
    }).then(function (value) {
      const balanceElement = document.getElementById('balance')
      balanceElement.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting balance; see log.')
    })
  },*/


  addEmployee: function(){
      const self = this
      let Payr
      const employee = document.getElementById('employee').value
      const salary = parseInt(document.getElementById('salary').value)
      const bonus = parseInt(document.getElementById('bonus').value)
      //account =  document.getElementById('account').value
      PayRoll.deployed().then(function (instance) {
        Payr = instance
        Payr.addEmployee.sendTransaction(employee, salary, bonus, { from: account, gas:4700000})
        return 
      }).then(function () {
        const tElement = document.getElementById('totalemployees')
        tElement.innerHTML = parseInt(tElement.innerHTML)+1
        //self.getTotalemployee()
        self.setStatus('Add employee successfully!')
        self.computeFund()
      }).catch(function (e) {
        console.log(e)
        self.setStatus('Error add employee; see log.')
      })
  },

  removeEmployee: function(){
      const self = this
      let Payr
      const employee = document.getElementById('employee').value
      //account =  document.getElementById('account').value
      PayRoll.deployed().then(function (instance) {
        Payr = instance
        return Payr.removeEmployee.sendTransaction(employee,{ from: account, gas:4700000})
      }).then(function (value) {
        
        const tElement = document.getElementById('totalemployees')
        tElement.innerHTML = parseInt(tElement.innerHTML)-1
         //self.getTotalemployee()
        self.setStatus('Remove employee successfully!')
        self.computeFund()
        self.getBalance()
      }).catch(function (e) {
        console.log(e)
        self.setStatus('Error remove employee; see log.')
      })
  },

  updateEmployee: function(){
    const self = this
    let Payr
    const employee = document.getElementById('employee').value
    //account =  document.getElementById('account').value
    const salary = parseInt(document.getElementById('salary').value)
    PayRoll.deployed().then(function (instance) {
      Payr = instance
      Payr.updateEmployee.sendTransaction(employee, salary,{ from: account, gas:4700000})
      return 
    }).then(function () {
      self.setStatus('update employee successfully!')
      self.computeFund()
      self.getBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error update employee; see log.')
    })
  },

  addBonus: function(){
    const self = this
    let Payr
    const employee = document.getElementById('employee').value
    //account =  document.getElementById('account').value
    const bonus = parseInt(document.getElementById('bonus').value)
    PayRoll.deployed().then(function (instance) {
      Payr = instance
      Payr.addBonus.sendTransaction(employee, bonus,{ from: account, gas:4700000})
      return 
    }).then(function () {
      self.setStatus('add bonus successfully!')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error add bonus; see log.')
    })
  },

  getEmployee: function(){
    const self = this
    let Payr
    const employee = document.getElementById('employee').value
    //account =  document.getElementById('account').value
    PayRoll.deployed().then(function (instance) {
      Payr = instance
      return Payr.getEmployee.call(employee, bonus,{ from: account})
    }).then(function (value) {
      const tElement = document.getElementById('salary')
      const tElement2 = document.getElementById('bonus')
      const tElement3 = document.getElementById('past')
      tElement.value = value[0]
      tElement2.value = value[2]
      tElement3.value = value[1]
      self.setStatus('Get Employee successfully!')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error Get Employee; see log.')
    })
  },

  getTotalemployee: function(){
    const self = this
    let Payr

    PayRoll.deployed().then(function (instance) {
      Payr = instance
      return Payr.getTotalemployee.call({ from: account })
    }).then(function (value) {
      const tElement = document.getElementById('totalemployees')
      tElement.innerHTML = value.valueOf()
      self.computeFund()
    }).catch(function (e) {
      console.log(account)
      console.log(e)
      self.setStatus('Error getting total employees; see log.')
    })
  },

  addFund: function(){
    const self = this
    let Payr
    const amount = parseInt(document.getElementById('amount').value)
    //account =  document.getElementById('account').value
    PayRoll.deployed().then(function (instance) {
      Payr = instance
      return Payr.addFund.sendTransaction({ from: account, value:amount, gas:4700000})    
    }).then(function (value) {
      self.setStatus('add fund successfully!')
      self.computeFund()
      self.getBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error add fund; see log.')
    })
  },

  getBalance: function(){
    const self = this
    let Payr

    PayRoll.deployed().then(function (instance) {
      Payr = instance
      return Payr.getBalance.call({ from: account })
    }).then(function (value) {
      const tElement = document.getElementById('balance')
      tElement.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting total employees; see log.')
    })
  },

  computeFund: function(){
    const self = this
    let Payr

    PayRoll.deployed().then(function (instance) {
      Payr = instance
      return Payr.calculateSalary.call({ from: account })
    }).then(function (value) {
      const tElement = document.getElementById('enough')
      tElement.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error compute fund; see log.')
    })
    PayRoll.deployed().then(function (instance) {
      Payr = instance
      return Payr.isFundEnough.call({ from: account })    
    }).then(function (value) {
      const tElement = document.getElementById('enough')
      if(value.valueOf()== true)
        tElement.style.color = "green"
      else 
        tElement.style.color = "red"
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error compute fund; see log.')
    })
  },

  getPaid: function(){
    const self = this
    let Payr
    //account =  document.getElementById('account').value
    PayRoll.deployed().then(function (instance) {
      Payr = instance
      Payr.getPaid.sendTransaction({ from: account, gas:4700000})  
      return  
    }).then(function () {
      self.setStatus('Get paid successfully!')
      self.computeFund()
      self.getBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error get paid; see log.')
    })
  },

  getBonus: function(){
    const self = this
    let Payr
    //account =  document.getElementById('account').value
    PayRoll.deployed().then(function (instance) {
      Payr = instance
      Payr.getBonus.sendTransaction({ from: account, gas:4700000})  
      return  
    }).then(function () {
      self.setStatus('Get bonus successfully!')
      self.computeFund()
      self.getBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error get bonus; see log.')
    })
  },

  /*sendCoin: function () {
    const self = this

    const amount = parseInt(document.getElementById('amount').value)
    const receiver = document.getElementById('receiver').value

    this.setStatus('Initiating transaction... (please wait)')

    let meta
    MetaCoin.deployed().then(function (instance) {
      meta = instance
      return meta.sendCoin(receiver, amount, { from: account })
    }).then(function () {
      self.setStatus('Transaction complete!')
      self.refreshBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error sending coin; see log.')
    })
  }*/
}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:8545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  }

  App.start()
})
