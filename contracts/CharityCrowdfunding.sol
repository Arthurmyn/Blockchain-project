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
    }

    function donate(uint256 _campaignId) external payable {
    }

    function finalizeCampaign(uint256 _campaignId) external {
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