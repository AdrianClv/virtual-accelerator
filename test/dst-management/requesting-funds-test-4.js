var assert = require('assert');

var log = console.log;

var Workbench = require('ethereum-sandbox-workbench');
var workbench = new Workbench({
  defaults: {
    from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826'
  }, 
  
  solcVersion: '0.4.6'
});

workbench.startTesting(['StandardToken', 'EventInfo', 'DSTContract', 'VirtualExchange'],  function(contracts) {

var sandbox = workbench.sandbox;

// deployed contracts 
var eventInfo;
var hackerGold;
var virtualExchange;

var dstContract_APL;  // Awesome Poker League

function printDate(){
   now = eventInfo.getNow().toNumber();
   var date = new Date(now*1000);
   
   log('\n Date now: ' + date + '\n');    
}


/**
 * 
 * Testing for issue project token series: 
 *  
 *     1. Create structure of DST 30% / 30% / 40% - owners 
 *     2. Object 1st proposal by 30% => the proposal is go through 
 *     3. Object 2st proposal by 70% => the proposal is rejected
 *     4. Roll 6 months and collect all the funds. 
 *
 */
 
it('event-info-init', function() {
    
    log('');
    log(' *****************************');
    log('  requesting-funds-test-4.js  ');
    log(' *****************************');
    log('');
        
    return contracts.EventInfo.new()

        .then(function(contract) {
          
          if (contract.address){
            eventInfo = contract;
          } else {
            throw new Error('No contract address');
          }        
          
          return true;        
        })
        
        .then(function() {
            
           printDate();           
           return true;
        });
    
});
 

it('hacker-gold-init', function() {

    return contracts.HackerGold.new()

        .then(function(contract) {
          
          if (contract.address){
            hackerGold = contract;
          } else {
            throw new Error('No contract address');
          }        
          
          return true;        
    });        
});
 


it('roll-time-ve-trading-start', function(){
   
    // Roll time to get best price on HKG, 
    // 1 Ether for 200 HKG      
    return workbench.rollTimeTo('30-Oct-2016 14:00 UTC+00')
    .then(function(contract) { printDate(); return true; });
});


it('buy-hkg-for-3a7e', function() {
    log("");
    log(" (!) Action: [0x3a7e] buy [HKG] for 10000 Ether");    

    return workbench.sendTransaction({
      from: '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',
      to: hackerGold.address,
      value: sandbox.web3.toWei(10000, 'ether')
    })
    
    .then(function (txHash) {
 
          return workbench.waitForReceipt(txHash);          
    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;
          
          log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");
          assert.equal(2000000, value);
    
          return true;          
    })
    
});


it('buy-hkg-for-2980', function() {
    log("");
    log(" (!) Action: [0x2980] buy [HKG] for 10,000.000 Ether");    

    return workbench.sendTransaction({
      from: '0x29805ff5b946e7a7c5871c1fb071f740f767cf41',
      to: hackerGold.address,
      value: sandbox.web3.toWei(10000, 'ether')
    })
    
    .then(function (txHash) {
 
          return workbench.waitForReceipt(txHash);          
    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0x29805ff5b946e7a7c5871c1fb071f740f767cf41').toNumber() / 1000;
          
          log("[0x2980] => balance: " + value.toFixed(3) + " HKG");
          assert.equal(2000000, value);
    
          return true;          
    })
    
});


it('buy-hkg-for-696b', function() {
    log("");
    log(" (!) Action: [0x696b] buy [HKG] for 5000.000 Ether");    

    return workbench.sendTransaction({
      from: '0x696ba93ef4254da47ff05b6caa88190db335f1c3',
      to: hackerGold.address,
      value: sandbox.web3.toWei(10000, 'ether')
    })
    
    .then(function (txHash) {
 
          return workbench.waitForReceipt(txHash);          
    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0x696ba93ef4254da47ff05b6caa88190db335f1c3').toNumber() / 1000;
          
          log("[0x696b] => balance: " + value.toFixed(3) + " HKG");
          assert.equal(2000000, value);
    
          return true;          
    })
    
});


it('buy-hkg-for-cd2a', function() {
    log("");
    log(" (!) Action: [0xcd2a] buy [HKG] for 5000.000 Ether");    

    return workbench.sendTransaction({
      from: '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',
      to: hackerGold.address,
      value: sandbox.web3.toWei(10000, 'ether')
    })
    
    .then(function (txHash) {
 
          return workbench.waitForReceipt(txHash);          
    })

    .then(function (txHash) {

          value = hackerGold.balanceOf('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826').toNumber() / 1000;
          
          log("[0xcd2a] => balance: " + value.toFixed(3) + " HKG");
          assert.equal(2000000, value);
    
          return true;          
    })
    
});



it('roll-time-ve-trading-start', function(){
   
    return workbench.rollTimeTo('24-Nov-2016 14:00 UTC+00')
    .then(function(contract) { printDate(); return true; });
});




it('virtual-exchange-init', function() {

    return contracts.VirtualExchange.new(hackerGold.address, 
                                         eventInfo.address)
        .then(function(contract) {
          
          if (contract.address){
            virtualExchange = contract;
          } else {
            throw new Error('No contract address');
          }        
          
          return true;        
    });        
});


it('dst-contract-apl-init', function() {

    return contracts.DSTContract.new(eventInfo.address, hackerGold.address, "Awesome Poker League", "APL", 
        
        {
            from : '0xcc49bea5129ef2369ff81b0c0200885893979b77'
        })

        .then(function(contract) {
          
          if (contract.address){
            dstContract_APL = contract;
          } else {
            throw new Error('No contract address');
          }        
          
          return true;        
    });        
});



it('enlist-apl', function() {
    log("");
    log(" (!) Action: [VE] enlist [APL] for trading");

    return virtualExchange.enlist(dstContract_APL.address, 
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',       
    })
       
   .then(function(txHash) {
      
      // we are waiting for blockchain to accept the transaction 
      return workbench.waitForReceipt(txHash);
    })
    
   .then(function() {
                
      exist = virtualExchange.isExistByBytes(dstContract_APL.getDSTSymbolBytes()); 
      
      log("[APL] => enlisted: " + exist);
      assert.equal(true, exist);
      
      return true;
    })
    
});


it('issue-apl-tokens-seria-1', function() {
    log("");
    log(" (!) Action: [APL] issue tokens on [VE] balance 1,000,000,000,000.000 APL");
                           
    return dstContract_APL.issuePreferedTokens(1000, 1000000000000, 
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',       
    })

    .then(function () {
    
        dst1Total = dstContract_APL.getTotalSupply().toNumber() / 1000;
        
        log("[APL] => total suply: " + dst1Total.toFixed(3) + " APL");
        assert(1000000000000, dst1Total);
        
        veTokens = dstContract_APL.allowance(dstContract_APL.address, 
                                          virtualExchange.address).toNumber() / 1000;
        log("[APL] => total on VirtualExchange: " + veTokens.toFixed(3) + " APL");
        assert(1000000000000, veTokens);

        return true;
    })
});



it('approve-hkg-spend-on-exchange-for-3a7e', function() {
    log("");
    log(" (!) Action: [0x3a7e] move to [VE] balance 1,000,000.000 HKG");
                                                       
    return hackerGold.approve(virtualExchange.address, 2000000000, 
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',       
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);          
    })    
    
    .then(function () {

        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d', 
                                          virtualExchange.address).toNumber() / 1000;
                                          
        log("[0x3a7e] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(2000000, veTokens);
        
        return true;
    })
});


it('approve-hkg-spend-on-exchange-for-2980', function() {
    log("");
    log(" (!) Action: [0x2980] move to [VE] balance 2,000,000.000 HKG");
                                                       
    return hackerGold.approve(virtualExchange.address, 2000000000, 
    {
       from : '0x29805ff5b946e7a7c5871c1fb071f740f767cf41',       
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);          
    })    
    
    .then(function () {

        veTokens = hackerGold.allowance('0x29805ff5b946e7a7c5871c1fb071f740f767cf41', 
                                          virtualExchange.address).toNumber() / 1000;
                                          
        log("[0x2980] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(2000000, veTokens);
        
        return true;
    })
});


it('approve-hkg-spend-on-exchange-for-696b', function() {
    log("");
    log(" (!) Action: [0x696b] move to [VE] balance 1,000,000.000 HKG");
                                                       
    return hackerGold.approve(virtualExchange.address, 2000000000, 
    {
       from : '0x696ba93ef4254da47ff05b6caa88190db335f1c3',       
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);          
    })    
    
    .then(function () {

        veTokens = hackerGold.allowance('0x696ba93ef4254da47ff05b6caa88190db335f1c3', 
                                          virtualExchange.address).toNumber() / 1000;
                                          
        log("[0x696b] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(2000000, veTokens);
        
        return true;
    })
});



it('approve-hkg-spend-on-exchange-for-cd2a', function() {
    log("");
    log(" (!) Action: [0xcd2a] move to [VE] balance 1,000,000.000 HKG");
                                                       
    return hackerGold.approve(virtualExchange.address, 2000000000, 
    {
       from : '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826',       
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);          
    })    
    
    .then(function () {

        veTokens = hackerGold.allowance('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826', 
                                          virtualExchange.address).toNumber() / 1000;
                                          
        log("[0xcd2a] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(2000000, veTokens);
        
        return true;
    })
});


it('buy-apl-by-3a7e', function() {
    log("");
    log(" (!) Action: [0x3a7e] buy tokens [APL] for 300,000.000 HKG");

    
    return virtualExchange.buy('APL', 300000000, 
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',   
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);          

    })    
    
    .then(function () {

        dst1Balance = dstContract_APL.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;
        
        log("[0x3a7e] => balance: " + dst1Balance.toFixed(3) + " APL");
        assert.equal(300000000 , dst1Balance);
        
        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');
        
        log ("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(300000000000 , voting);

        value = hackerGold.balanceOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber() / 1000;
        
        log("[0x3a7e] => balance: " + value.toFixed(3) + " HKG");
        assert.equal(1700000, value); 
                
        log ("[APL] => total: " + total + " votes");
        assert.equal(300000000000, total);
        
        veTokens = hackerGold.allowance('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d', 
                                          virtualExchange.address).toNumber() / 1000;
        log("[0x3a7e] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(1700000 , veTokens);

        availableSuply = dstContract_APL.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => available suply: " + availableSuply + " APL");    
        assert.equal(700000000 , availableSuply);
        
        return true;
    })
});




it('buy-apl-by-2980', function() {
    log("");
    log(" (!) Action: [0x2980] buy tokens [APL] for 300,000.000 HKG");

    
    return virtualExchange.buy('APL', 300000000, 
    {
       from : '0x29805ff5b946e7a7c5871c1fb071f740f767cf41',   
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);          

    })    
    
    .then(function () {

        dst1Balance = dstContract_APL.balanceOf('0x29805ff5b946e7a7c5871c1fb071f740f767cf41').toNumber() / 1000;
        
        log("[0x2980] => balance: " + dst1Balance.toFixed(3) + " APL");
        assert.equal(300000000 , dst1Balance);
        
        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x29805ff5b946e7a7c5871c1fb071f740f767cf41');
        
        log ("[0x2980] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(300000000000 , voting);

        value = hackerGold.balanceOf('0x29805ff5b946e7a7c5871c1fb071f740f767cf41').toNumber() / 1000;
        
        log("[0x2980] => balance: " + value.toFixed(3) + " HKG");
        assert.equal(1700000, value);
                
        log ("[APL] => total: " + total + " votes");
        
        veTokens = hackerGold.allowance('0x29805ff5b946e7a7c5871c1fb071f740f767cf41', 
                                          virtualExchange.address).toNumber() / 1000;
        log("[0x2980] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(1700000 , veTokens);
        
        availableSuply = dstContract_APL.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => available suply: " + availableSuply + " APL");    
        

        log("");
        log(" Voting Summary: ");
        log(" =============== ");
          
        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');
            
        log ("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(50, voting / total * 100);
          
        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x29805ff5b946e7a7c5871c1fb071f740f767cf41');
            
        log ("[0x2980] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(50, voting / total * 100);     

        value = hackerGold.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => collected: " + value.toFixed(3) + " HKG");
        assert.equal(600000, value);         
        
        return true;
    })
});




it('buy-apl-by-696b', function() {
    log("");
    log(" (!) Action: [0x696b] buy tokens [APL] for 400,000.000 HKG");

    
    return virtualExchange.buy('APL', 400000000, 
    {
       from : '0x696ba93ef4254da47ff05b6caa88190db335f1c3',   
       gas: 250000,
    })

    .then(function (txHash) {

          return workbench.waitForReceipt(txHash);          
    })    
    
    .then(function () {

        dst1Balance = dstContract_APL.balanceOf('0x696ba93ef4254da47ff05b6caa88190db335f1c3').toNumber() / 1000;
        
        log("[0x696b] => balance: " + dst1Balance.toFixed(3) + " APL");
        assert.equal(400000000 , dst1Balance);
        
        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x696ba93ef4254da47ff05b6caa88190db335f1c3');
        
        log ("[0x696b] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(400000000000 , voting);

        value = hackerGold.balanceOf('0x696ba93ef4254da47ff05b6caa88190db335f1c3').toNumber() / 1000;
        
        log("[0x696b] => balance: " + value.toFixed(3) + " HKG");
        assert.equal(1600000, value);
                
        log ("[APL] => total: " + total + " votes");
        
        veTokens = hackerGold.allowance('0x696ba93ef4254da47ff05b6caa88190db335f1c3', 
                                          virtualExchange.address).toNumber() / 1000;
        log("[0x696b] => VirtualExchange balance: " + veTokens.toFixed(3) + " HKG");
        assert.equal(1600000 , veTokens);
        
        availableSuply = dstContract_APL.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => available suply: " + availableSuply + " APL");    
        

        log("");
        log(" Voting Summary: ");
        log(" =============== ");
          
        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d');
            
        log ("[0x3a7e] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(30, voting / total * 100);
          
        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x29805ff5b946e7a7c5871c1fb071f740f767cf41');
            
        log ("[0x2980] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(30, voting / total * 100);     

        total  = dstContract_APL.getPreferedQtySold();
        voting = dstContract_APL.votingRightsOf('0x696ba93ef4254da47ff05b6caa88190db335f1c3');
            
        log ("[0x696b] => voting: " + voting + " votes - " + voting / total * 100 + "%");
        assert.equal(40, voting / total * 100);     

        value = hackerGold.balanceOf(dstContract_APL.address).toNumber() / 1000;
        log("[APL] => collected: " + value.toFixed(3) + " HKG");
        assert.equal(1000000, value);         
        
        return true;
    })
});



it('roll-time-va-ends', function(){
   
    return workbench.rollTimeTo('22-Dec-2016 14:00 UTC+00')
    .then(function(contract) { printDate(); return true; });
});


it('roll-time-50%-available', function(){
   
    return workbench.rollTimeTo('22-Feb-2017 14:00 UTC+00')
    .then(function(contract) { printDate(); return true; });
});

it('submit-proposal-1', function() {
    log("");                                  
    log(" (!) Action: [0xcc49] ask to recieve 200,000.000 (20%) of the HKG collected");
                                             
    return dstContract_APL.submitHKGProposal(200000000, "http://pastebin.com/raw/6e9PBTeP", 
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',   
       gas : 450000,       
    })

    .then(function (txHash) {
    
        return workbench.waitForReceipt(txHash);        
        
    })
    
    .then(function (parsed) {
        
       args = parsed.logs[0].args;       
       
       proposalId = args.id;
       proposalValue = args.value;
       proposalValue = proposalValue / 1000;
       
       proposalTimeEnds = args.timeEnds;
       proposalURL = args.url;
       proposalSender = args.sender;
       
       log("");
       log("Proposal Submitted");
       log("==================");
       
       log("proposalId: "       + proposalId);
       log("proposalValue: "    + proposalValue.toFixed(3));
       log("proposalTimeEnds: " + proposalTimeEnds);
       log("proposalURL: "      + proposalURL);
       log("proposalSender: "   + proposalSender);
       
       
       assert.equal(200000, proposalValue);
       
       t1 = eventInfo.getNow().toNumber() + 60 * 60 * 24 * 10;
       t2 = proposalTimeEnds;
       assert(t1, t2);

       assert.equal(proposalURL,    "http://pastebin.com/raw/6e9PBTeP");
       assert.equal(proposalSender, "0xcc49bea5129ef2369ff81b0c0200885893979b77");
       
       proposal_1 = proposalId;
               
       value = hackerGold.balanceOf('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber() / 1000;
        
       log("[0xcc49] => balance: " + value.toFixed(3) + " HKG");       
       assert.equal(0, value);     
       
       return true;                
    })

});



it('object-by-vote-proposal-1', function() {
    log(""); 
    log(" (!) Action: [0x3a7e] vote to object proposal 1");
                           
    return dstContract_APL.objectProposal(proposal_1, 
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',   
       gas : 450000,       
    })

    .then(function (txHash) {
    
        return workbench.waitForReceipt(txHash);        
        
    })
    
    .then(function (parsed) {
         
       log_1 = parsed.logs[0];
        
       total  = dstContract_APL.getPreferedQtySold();
       
       log("\n");
       log(log_1.event + ":");
       log("============");
       
       log("proposal.id: " + log_1.args.id);
       log("voter: " + log_1.args.voter);
       log("votes: " + log_1.args.votes + " share: " + (log_1.args.votes / total * 100).toFixed(2) + "%");
       
       voting = dstContract_APL.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber();
              
       assert.equal(proposal_1, log_1.args.id);
       assert.equal(log_1.args.voter, "0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d");
       assert.equal(log_1.args.votes, voting);
              
       return true;                
    })

});


it('roll-time-proposal-redeem', function(){
   
    return workbench.rollTimeTo('04-Mar-2017 14:01 UTC+00')
    .then(function(contract) { printDate(); return true; });
});


it('redeem-proposal-1', function() {
    log("");
    log(" (!) Action: [0xcc49] collect 1,000.000 HKG value of proposal 1");
                           
    return dstContract_APL.redeemProposalFunds(proposal_1, 
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',   
       gas : 350000,       
    })  

    .then(function (txHash) {
    
        return workbench.waitForReceipt(txHash);        
        
    })
    
    .then(function (parsed) {
       
       assert.equal(1, parsed.logs.length);

       args = parsed.logs[0].args;       
       
       assert(dstContract_APL.address, args.from);
       assert("0xcc49bea5129ef2369ff81b0c0200885893979b77", args.to);
       assert(200000000, args.value);
       
       return true;                
    })
    
    .then(function () {
              
       value = hackerGold.balanceOf('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber() / 1000;
        
       log("[0xcc49] => balance: " + value.toFixed(3) + " HKG");       
       assert.equal(200000, value);
           
       value = hackerGold.balanceOf(dstContract_APL.address).toNumber() / 1000;
        
       log("[APL] => balance: " + value.toFixed(3) + " HKG");       
       assert.equal(800000, value);

       return true;                
    })

});



it('roll-time-for-new-proposal-submit', function(){
   
    return workbench.rollTimeTo('08-Mar-2017 14:02 UTC+00')
    .then(function(contract) { printDate(); return true; });
});



it('submit-proposal-2', function() {
    log("");
    log(" (!) Action: [0xcc49] ask to recieve 200,000.000 (20%) of the HKG collected");
                           
    return dstContract_APL.submitHKGProposal(200000000, "http://pastebin.com/raw/6e9PBTeP", 
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',   
       gas : 450000,       
    })

    .then(function (txHash) {
    
        return workbench.waitForReceipt(txHash);        
        
    })
    
    .then(function (parsed) {
       
       
       args = parsed.logs[0].args;       
       
       proposalId = args.id;
       proposalValue = args.value;
       proposalValue = proposalValue / 1000;
       
       proposalTimeEnds = args.timeEnds;
       proposalURL = args.url;
       proposalSender = args.sender;
       
       log("");
       log("Proposal Submitted");
       log("==================");
       
       log("proposalId: "       + proposalId);
       log("proposalValue: "    + proposalValue.toFixed(3));
       log("proposalTimeEnds: " + proposalTimeEnds);
       log("proposalURL: "      + proposalURL);
       log("proposalSender: "   + proposalSender);
       
       
       assert.equal(200000, proposalValue);
       
       t1 = eventInfo.getNow().toNumber() + 60 * 60 * 24 * 10;
       t2 = proposalTimeEnds;
       assert(t1, t2);

       assert.equal(proposalURL,    "http://pastebin.com/raw/6e9PBTeP");
       assert.equal(proposalSender, "0xcc49bea5129ef2369ff81b0c0200885893979b77");
       
       proposal_2 = proposalId;
               
       value = hackerGold.balanceOf('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber() / 1000;
        
       log("[0xcc49] => balance: " + value.toFixed(3) + " HKG");       
       assert.equal(200000, value);     

       return true;                
    })

});


it('object-by-vote-proposal-2-voter-3a7e', function() {
    log(""); 
    log(" (!) Action: [0x3a7e] vote to object proposal 1");
                           
    return dstContract_APL.objectProposal(proposal_2, 
    {
       from : '0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d',   
       gas : 450000,       
    })

    .then(function (txHash) {
    
        return workbench.waitForReceipt(txHash);        
        
    })
    
    .then(function (parsed) {
         
       log_1 = parsed.logs[0];
        
       total  = dstContract_APL.getPreferedQtySold();
       
       log("\n");
       log(log_1.event + ":");
       log("============");
       
       log("proposal.id: " + log_1.args.id);
       log("voter: " + log_1.args.voter);
       log("votes: " + log_1.args.votes + " share: " + (log_1.args.votes / total * 100).toFixed(2) + "%");
       
       voting = dstContract_APL.votingRightsOf('0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d').toNumber();
              
       assert.equal(proposal_2, log_1.args.id);
       assert.equal(log_1.args.voter, "0x3a7e663c871351bbe7b6dd006cb4a46d75cce61d");
       assert.equal(log_1.args.votes, voting);
              
       return true;                
    })

});


it('object-by-vote-proposal-2-voter-696b', function() {
    log(""); 
    log(" (!) Action: [0x696b] vote to object proposal 1");
                           
    return dstContract_APL.objectProposal(proposal_2, 
    {
       from : '0x696ba93ef4254da47ff05b6caa88190db335f1c3',   
       gas : 450000,       
    })

    .then(function (txHash) {
    
        return workbench.waitForReceipt(txHash);        
        
    })
    
    .then(function (parsed) {
         
       log_1 = parsed.logs[0];
        
       total  = dstContract_APL.getPreferedQtySold();
       
       log("\n");
       log(log_1.event + ":");
       log("============");
       
       log("proposal.id: " + log_1.args.id);
       log("voter: " + log_1.args.voter);
       log("votes: " + log_1.args.votes + " share: " + (log_1.args.votes / total * 100).toFixed(2) + "%");
       
       voting = dstContract_APL.votingRightsOf('0x696ba93ef4254da47ff05b6caa88190db335f1c3').toNumber();
              
       assert.equal(proposal_2, log_1.args.id);
       assert.equal(log_1.args.voter, "0x696ba93ef4254da47ff05b6caa88190db335f1c3");
       assert.equal(log_1.args.votes, voting);
       
       totalObjected = dstContract_APL.getProposalObjectionByIndex(1);
              
       log("");
       log("Proposal objected: " + totalObjected / total * 100 + "%");       
              
       return true;                
    })

});



it('roll-time-proposal-redeem', function(){
   
    return workbench.rollTimeTo('18-Mar-2017 14:03 UTC+00')
    .then(function(contract) { printDate(); return true; });
});



it('redeem-proposal-2', function() {
    log("");
    log(" (!) Action: [0xcc49] collect 200,000.000 HKG value of proposal 2");
                           
    return dstContract_APL.redeemProposalFunds(proposal_2, 
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',   
       gas : 350000,       
    })

    .then(function (txHash) {
    
        return workbench.waitForReceipt(txHash);        
        
    })
    
    .then(function (parsed) {
       
       assert.equal(0, parsed.logs.length);               
       return true;                
    })
    
    .then(function () {
              
       value = hackerGold.balanceOf('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber() / 1000;
        
       log("[0xcc49] => balance: " + value.toFixed(3) + " HKG");       
       assert.equal(200000, value);
           
       value = hackerGold.balanceOf(dstContract_APL.address).toNumber() / 1000;
        
       log("[APL] => balance: " + value.toFixed(3) + " HKG");       
       assert.equal(800000, value);

       return true;                
    })

});


//
//  [X] Action: [0xcc49] collect all the rest of HKG before 6 months over
//

it('collect-all-the-rest-funds-before-time', function() {
    log("");
    log(" [X] Action: [0xcc49] collect all the rest of HKG before 6 months over");
                           
    return dstContract_APL.getAllTheFunds( 
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',   
       gas : 350000,       
    })

    .then(function (txHash) {
    
        return workbench.waitForReceipt(txHash);        
    })
    
    .then(function (parsed) {
       
       assert.equal(0, parsed.logs.length);

       return true;                
    })
    
    .then(function () {
              
       value = hackerGold.balanceOf('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber() / 1000;
        
       log("[0xcc49] => balance: " + value.toFixed(3) + " HKG");       
       assert.equal(200000, value);
           
       value = hackerGold.balanceOf(dstContract_APL.address).toNumber() / 1000;
        
       log("[APL] => balance: " + value.toFixed(3) + " HKG");       
       assert.equal(800000, value);

       return true;                
    })

});


it('roll-time-for-total-redeem', function(){
   
    return workbench.rollTimeTo('22-June-2017 14:04 UTC+00')
    .then(function(contract) { printDate(); return true; });
});



//
//  [X] Action: [0xdedb] collect all the rest of HKG by non executive
//

it('collect-all-the-rest-funds-before-time', function() {
    log("");
    log(" [X] Action: [0xdedb] collect all the rest of HKG by non executive");
                           
    return dstContract_APL.getAllTheFunds( 
    {
       from : '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392',   
       gas : 350000,       
    })

    .then(function (txHash) {
    
        return workbench.waitForReceipt(txHash);        
    })
    
    .then(function (parsed) {
       
       assert.equal(0, parsed.logs.length);

       return true;                
    })
    
    .then(function () {
              
       value = hackerGold.balanceOf('0xdedb49385ad5b94a16f236a6890cf9e0b1e30392').toNumber() / 1000;
        
       log("[0xdedb] => balance: " + value.toFixed(3) + " HKG");       
       assert.equal(0, value);
           
       value = hackerGold.balanceOf(dstContract_APL.address).toNumber() / 1000;
        
       log("[APL] => balance: " + value.toFixed(3) + " HKG");       
       assert.equal(800000, value);

       return true;                
    })

});


it('collect-all-the-rest-funds', function() {
    log("");
    log(" (!) Action: [0xcc49] collect all the rest of HKG");
                           
    return dstContract_APL.getAllTheFunds( 
    {
       from : '0xcc49bea5129ef2369ff81b0c0200885893979b77',   
       gas : 350000,       
    })

    .then(function (txHash) {
    
        return workbench.waitForReceipt(txHash);        
    })
    
    .then(function (parsed) {
       
       assert.equal(1, parsed.logs.length);

       args = parsed.logs[0].args;       
       
       assert(dstContract_APL.address, args.from);
       assert("0xcc49bea5129ef2369ff81b0c0200885893979b77", args.to);
       assert(800000000, args.value);

       return true;                
    })
    
    .then(function () {
              
       value = hackerGold.balanceOf('0xcc49bea5129ef2369ff81b0c0200885893979b77').toNumber() / 1000;
        
       log("[0xcc49] => balance: " + value.toFixed(3) + " HKG");       
       assert.equal(1000000, value);
           
       value = hackerGold.balanceOf(dstContract_APL.address).toNumber() / 1000;
        
       log("[APL] => balance: " + value.toFixed(3) + " HKG");       
       assert.equal(0, value);

       return true;                
    })

});



});






