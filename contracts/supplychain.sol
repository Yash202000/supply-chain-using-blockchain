// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.0;


contract SupplyTracker{
    string public greeting;

    // we will track each cart with containerID
    uint public containerid;

    // Now create struct to store the three phases address.
    struct Txblocks {
        uint256 FTC; // blockfarmertocollector
        uint256 CTD; // blockcollectortodistributor
        uint256 DTR; // blockdistributortoretailer
    }

    // create the mapping for the containerobjects
    mapping(uint => Txblocks) containerhistory;


    //
    // create the struct and mapping for storing the FTC details.
    //
    uint public collectioncounter;
    struct Collectordetails {
        string farmername;
        string productname;
        uint freshness;
        string collectiondate;
    }

    mapping(uint => Collectordetails) collectorphase;

    //
    // create the struct and mapping for storing the CTD details;
    //

    uint public distributioncounter;
    struct Distributordetails {
        string productname;
        uint freshness;
        string collectiondate;
        string shippingdate;
    }
    mapping(uint => Distributordetails ) distributionphase;


    //
    // create the struct and mapping for the retailer phase RTC details
    //

    uint public retailcounter;
    struct Retailedetails {
        string productname;
        uint freshness;
        string collectiondate;
        string shippingdate;

    }
    mapping(uint=> Retailedetails) retailphase;


    // default constructor for storing the initial states for all the counters
    function default_ContainerID() public {
        greeting = "Hello";
        containerid = 0;
        collectioncounter = 0;
        distributioncounter = 0;
        retailcounter = 0;
    }

    //function for setting up the collection details along with the initializing the Txblock with mapping the history.
    function setCollectionDetail(string memory _farmername,
        string memory _productname,
        uint _freshness,
        string memory _collectiondate) public {
        
        Collectordetails memory object = Collectordetails(_farmername,_productname,_freshness,_collectiondate);
        collectioncounter += 1;
        containerid += 1;
        
        Txblocks memory memblock = Txblocks(collectioncounter,0,0);

        collectorphase[collectioncounter] = object;
        containerhistory[containerid] = memblock;

    }


    //show me the collectiondetails for the given collection counter.
    function getCollectionDetails(uint  _id) view public returns (
        string memory,
        string memory,
        uint,
        string memory
        ){
        
        Collectordetails memory object = collectorphase[_id];
        
        return (
            object.farmername,
            object.productname,
            object.freshness,
            object.collectiondate
        );
    }

    // function to set the distribution details
    function setDistributiondetails(
        uint _containerid,
        string memory _productname,
        uint _freshness,
        string memory _collectiondate,
        string memory _shippingdate) public {
        
        Distributordetails memory object = Distributordetails(_productname,_freshness,_collectiondate,_shippingdate);
        distributioncounter += 1;
        
        Txblocks memory memblock = containerhistory[_containerid];
        memblock.CTD = distributioncounter;

        distributionphase[distributioncounter] = object;
    }


    //show me the distributiondetails for the given distribution counter.
    function getDistributiondetails(uint  _id) view public returns (
        string memory,
        uint,
        string memory,
        string memory
        ){
        
         Distributordetails memory object  = distributionphase[_id];
        
        return (
            object.productname,
            object.freshness,
            object.collectiondate,
            object.shippingdate
        );
    }

    // function to set the distribution details
    function setRetailerdetails(
        uint _containerid,
        string memory _productname,
        uint _freshness,
        string memory _collectiondate,
        string memory _shippingdate) public {
        
        Retailedetails memory object = Retailedetails(_productname,_freshness,_collectiondate,_shippingdate);
        retailcounter += 1;
        
        Txblocks memory memblock = containerhistory[_containerid];
        memblock.DTR = retailcounter;

        retailphase[retailcounter] = object;
    }


    //show me the retaildetails for the given retaildistribution counter.
    function getRetaildetails(uint _id) view public returns (
        string memory,
        uint,
        string memory,
        string memory
        ){
        
         Retailedetails memory object  = retailphase[_id];
        
        return (
            object.productname,
            object.freshness,
            object.collectiondate,
            object.shippingdate
        );
    }
    

    // function to get containerid
    function getContainerid() view public returns (uint){
        return containerid;
    }


    // function to get Collectioncounter
    function getCollectioncounter() view public returns (uint){
        return collectioncounter;
    }

    
    // function to get distirbution
    function getDistributioncounter() view public returns (uint){
        return distributioncounter;
    }

    // function to get retailcounter
    function getRetailcounter() view public returns (uint){
        return retailcounter;
    }



    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }

    function greet() view public returns (string memory){
        return greeting;
    }
}