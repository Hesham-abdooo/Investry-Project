import React from 'react';
import "./HIW.css";
import Backers from "../../../assets/backers.png";
import live from "../../../assets/live.png";
import Equity from "../../../assets/equity.png";
import Mudbarah from "../../../assets/mudbarah.png"
import Reward from "../../../assets/reward.png"
import FeatContainer from "../../../assets/featContainer.png"
import { FiLock } from "react-icons/fi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { GoShieldCheck } from "react-icons/go";
import { MdContentPasteSearch } from "react-icons/md";


function HIW(){
    return(
      <>
 <div className="background">
        <div className='content'>
            <h1 id='he'>Fund the Future.</h1>
            <h1 id='she'>Invest with Confidence.</h1>
            <p>InvesTry connects visionary founders with smart investors
                through transparent, secure, and Sharia-compliant
                crowdfunding.
            </p>
            <button className='start_btn'>Start a Project</button>
            <button className='explore_btn'>Explore Campaigns</button>
        </div>
        <div>
            <div className='live_campaigns'>
                <span>
                <img src={live} alt="Live Campaigns" />
                </span>
            </div>
            <div className='Active_backers'>
                <span>
                <img src={Backers} alt="Active Backers" />
                </span>
            </div>
        </div>
    </div>

{/**--------------------------------------------------HOW IT WORKS--------------------------------------------------- */}
        <div className="hiw_bg">
            <div className='hiw_head'>
            <h1>How it works</h1>
            <p>Join thousands of founders and investors building the future together in three
                simple steps.
            </p>
            </div>
            <section className="steps">
        <div className="steps-container">

    <div className="step">
      <div className="circle yellow">1</div>
      <h3>Create Account</h3>
      <p>Sign up and complete our secure identity verification process in minutes.</p>
    </div>

    <div className="step">
      <div className="circle blue">2</div>
      <h3>Launch or Discover</h3>
      <p>Pitch your groundbreaking idea or browse curated high-potential startups.</p>
    </div>

    <div className="step">
      <div className="circle green">3</div>
      <h3>Invest Securely</h3>
      <p>Fund projects with confidence and track your returns seamlessly.</p>
    </div>

  </div>
          </section>
</div>
{/*-----------------------------------------------FUNDING MODLES----------------------------------------- */}

  <div className='FM-head'>
    <h1>Funding Models</h1>
    <p>Choose the investment path that aligns with your goals and values.</p>
  </div>
  <section className='funds'>
      <div className='cards-container'>
    <div className='cards'>
      <img src={Reward} alt="Reward-based" />
      <h1>Reward-based</h1>
      <p>Back a project early and receive exclusive products, experiences, or perks in return.</p>
      <a href="/">Learn more</a>
    </div>
  </div>
  <div className='cards-container'>
    <div className='cards'>
      <img src={Equity} alt="Equity-based" />
      <h1>Equity-based</h1>
      <p>Invest directly in promising startups and own a share of their future success.</p>
      <a href="/">Learn more</a>
    </div>
  </div>
  <div className='cards-container'>
    <div className='cards'>
      <img src={Mudbarah} alt="Mudbarah" />
      <h1>Mudarabah</h1>
      <p>Participate in Sharia-compliant profit-sharing investments with vetted businesses.</p>
      <a href="/">Learn more</a>
    </div>
  </div>
  </section>

  {/*-------------------------------------------Featured Campaigns------------------------------------------*/}

<div className='featured_bg'>
  <div className='featured-head'>
    <div className='feat-head'>
    <h1>Featured Campaigns</h1>
    <p>Discover high-potential projects actively raising funds.</p>
    </div>
    <div className='feat-btn'>
      <button>View all Campaigns</button>
    </div>
  </div>
  <section>
    <div className='feat-container'>
          <img src={FeatContainer} alt="" />
    </div>
  </section>
</div>
  {/*----------------------------------------------------------------------------------------------------*/}

  <div className='overview'>

    <div className='view'>
      <h1>$12.4M+</h1>
      <p>Total raised</p>

    </div>
    <div className='view'>
      <h1>340+</h1>
      <p>Active Campaigns</p>

    </div>
    <div className='view'>
      <h1>8,200+</h1>
      <p>Registerd Investors</p>

    </div>
    <div className='view'>
      <h1>87%</h1>
      <p>Success Rate</p>

    </div>

  </div>
  {/*-----------------------------------------TRUST & SECURITY---------------------------*/}
      <div className='T-head'>
        <h1>Trust & Security</h1>
        <p>Your funds are always protected with enterprise-grade security and transparency.</p>
      </div>
      <section className='security-EX'>

        <div className='sec-container'>

          <div className='ts'>
            <div className='T-icons'><FiLock/></div>
            <h3>Escrow Protection</h3>
            <p>Funds are held securely until campaign milestones are met.</p>
          </div>
          <div className='ts'>
            <div className='T-icons'><IoMdCheckmarkCircleOutline/></div>
            <h3>KYC Verified</h3>
            <p>Every founder and investor passes rigorous identity checks.</p>
          </div>
          <div className='ts'>
            <div className='T-icons'><GoShieldCheck/></div>
            <h3>AES-256 Encrypted</h3>
            <p>Bank-level encryption protects your personal and financial data.</p>
          </div>
          <div className='ts'>
            <div className='T-icons'><MdContentPasteSearch/></div>
            <h3>Audit Trail</h3>
            <p>Transparent tracking of all platform transactions and agreements.</p>
          </div>
            
        </div>
      </section>
        </>
    )
}
export default HIW;