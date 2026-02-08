// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "./charityToken.sol";

contract CharityCrowdfunding {

    CharityToken public rewardToken;

    struct Campaign {
        address creator;
        string title;
        uint256 goal;
        uint256 deadline;
        uint256 totalCollected;
        bool finalized;
    }

    Campaign[] public campaigns;

    mapping(uint256 => mapping(address => uint256)) public donations;

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        string title,
        uint256 goal,
        uint256 deadline
    );

    event DonationMade(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    event RewardMinted(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 tokenAmount
    );

    event CampaignFinalized(
        uint256 indexed campaignId,
        uint256 totalCollected
    );

    constructor(address _tokenAddress) {
        rewardToken = CharityToken(_tokenAddress);
    }

    function createCampaign(
        string calldata _title,
        uint256 _goal,
        uint256 _duration
    ) external {
        require(_goal > 0, "Goal must be > 0");
        require(_duration > 0, "Duration must be > 0");

        uint256 deadline = block.timestamp + (_duration * 1 days);

        campaigns.push(Campaign({
            creator: msg.sender,
            title: _title,
            goal: _goal,
            deadline: deadline,
            totalCollected: 0,
            finalized: false
        }));

        emit CampaignCreated(campaigns.length - 1, msg.sender, _title, _goal, deadline);
    }

    function donate(uint256 _campaignId) external payable {
        require(_campaignId < campaigns.length, "Invalid campaign ID");
        require(block.timestamp < campaigns[_campaignId].deadline, "Campaign ended");
        require(msg.value > 0, "Donation must be > 0");

        Campaign storage campaign = campaigns[_campaignId];
        campaign.totalCollected += msg.value;
        donations[_campaignId][msg.sender] += msg.value;

        // 1 CRT per 1 ETH donated (both use 18 decimals)
        uint256 rewardAmount = msg.value;
        rewardToken.mint(msg.sender, rewardAmount);
                
        emit DonationMade(_campaignId, msg.sender, msg.value);
        emit RewardMinted(_campaignId, msg.sender, rewardAmount);
    }

    function finalizeCampaign(uint256 _campaignId) external {
        require(_campaignId < campaigns.length, "Invalid campaign ID");
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.creator, "Only creator");
        require(block.timestamp >= campaign.deadline || campaign.totalCollected >= campaign.goal, "Not ready");
        require(!campaign.finalized, "Already finalized");

        campaign.finalized = true;
        
        uint256 amount = campaign.totalCollected;
        if (amount > 0) {
            (bool sent, ) = payable(campaign.creator).call{value: amount}("");
            require(sent, "Failed to send Ether");
        }

        emit CampaignFinalized(_campaignId, amount);
    }

    function getCampaignsCount() external view returns (uint256) {
        return campaigns.length;
    }

    function getCampaign(uint256 _campaignId)
        external
        view
        returns (
            address creator,
            string memory title,
            uint256 goal,
            uint256 deadline,
            uint256 totalCollected,
            bool finalized
        )
    {
        Campaign storage c = campaigns[_campaignId];
        return (
            c.creator,
            c.title,
            c.goal,
            c.deadline,
            c.totalCollected,
            c.finalized
        );
    }
}
