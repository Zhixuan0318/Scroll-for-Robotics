<div align="center">
    <img src="https://github.com/user-attachments/assets/a9678b29-1822-470f-84d6-6de857fbfc64" width=150>
    <h1>Scroll for Robotics</h1>
    <strong>Connecting Industrial Robotic Automations to Scroll</strong>  
</div>

<br>

![Frame 5 (7)](https://github.com/user-attachments/assets/6009f617-ec06-43b4-a9e6-19fea83236db)

## 📦 Our Deliverables

1. Our 5 mins Demo Video (Youtube) [🌐Watch It!]()
2. Our Pitch Deck (Google Drive) [🌐Read It!]()
3. Our Demo DApp (Deployed on Scroll Sepolia) [🌐Try It!]()

### Extra: Code Submission Breakdown 📃
For the convenience of the technical judges, our team has organized the code submission by breaking down the structure and providing descriptions for each folder and important files. You can access the documentation folder [🌐here]() !

<br>

## 👊 Problem We're Tackling

![image](https://github.com/user-attachments/assets/f95c8456-4c69-4244-b75f-6f8ce0f7d6a7)

Data centralization is one of the key issue when industries are operating their robotic automation in a web2-based infrastructure setup. Industries often adopt distributed manufacturing strategy which form a complex supply chain and involve various stakeholders and manufacturing units spreading in different locations. Hence, in a web2-based robotic infrastructure, each parties are actually siloed, as the data systems are disjoint, causing information asymmetry. In other words, A robot system in one factory may collect data that are not shared with robots in another factory, making it difficult to get a unified view of operations. The problems which arises will be:

#### ❌ Data is not Transparent: 

Factories and warehouses operating their robotic fleets in an isolated data systems or across various locations, will create a "visibility gap" that limits transparency and access to real-time operational data for stakeholders.
   
#### ❌ Low Efficiency + Track and Trace Challenge: 

Workflow efficiency suffers due to the complex data integration processes that slow decision-making and create operational bottlenecks. This lack of transparency also complicates essential tasks like tracking the history of production or the origin of raw materials, even among connected facilities. The underlying reason is the lack of clear auditing trials which can be easily access, and this is a classic problem in supply chain sector.
   
#### ❌ Security Concerns: 

Security concerns are heightened in Web2 environments, where mutable data is vulnerable to tampering and counterfeiting, which is considered a damage to the supply chain trust. Additionally, the risk of a single point of failure can lead to significant disruptions, cascading through the entire robotic automation operation.

## 💡 Inspirations: Really Motivated Us!

To address the problems, letting current industries robotic setup to transition and utilise a Scroll-connected distributed data system is a smart move. The intuition behind is simple: Every action taken by a robot in a factory is recorded on the blockchain, making product movement, quality checks, and production steps fully transparent, traceable, verifiable, and tamper-resistant, significantly enhancing security and auditability for all supply chain stakeholders. Our team had included this in our demo video, don't miss it! 

Moreover, as industries are constructed with intricate real-world components, representing these components on-chain is essential. By tokenizing physical robots—where each robot unit is an ERC721 token—and industry inventories—where each inventory item, such as raw materials or supplier resources, is an ERC1155 collection—these real-world assets (RWA) become fully manageable and controllable on Scroll. 

#### ⭐ Key Benefits for Industries: 

1. Full traceability and auditability
2. Data are immutable and highly secure
3. Full flexibility, either partially or fully shifting to Scroll
4. Smart contracts for automated and secure control of robotic fleet operations
5. Ready-made Web3 services in Scroll ecosystem for on-chain components setup
6. Resilient robotic network for industry
7. Vendor independence. No more traditional vendor-locked-in system
8. Reducing long term cost for Web2 infrastructure maintenance.

## ⚔️ Existing Solutions and Challenges

Existing solutions for implementing robotic automation in industries include a variety of software platforms (such as Gazebo and Webots), industry-specific solutions (like those from ABB, KUKA, and Fanuc), and integration tools (including ROS, AWS IoT, and Microsoft Azure IoT Hub). However, challenges emerge when considering the implementation of Web3 solutions in robotic automated operations. A significant hurdle is that the Scroll ecosystem lacks robotics-related development tools to facilitate the integration of blockchain solutions with existing legacy systems, which are often incompatible.

>  A simple example: while developing a prototype for our demo, we found that no industry-grade robotic simulators offer tools for easily interacting with Scroll on-chain events to conduct simulations.

☹️☹️☹️ Although industries can create their own tools or middleware for Web3 integration, this approach can be costly, time-consuming, and resource-intensive. We need a solution to bridge the gap between industry robotic automation (web2 layer) and the Scroll ecosystem (web3 layer).

Here is a concept illustration:

![image](https://github.com/user-attachments/assets/fff4d063-2413-4e62-ad0a-27c2ac3bdabf)

## 💪 We launch Scroll for Robotics (Our Solution)

Hence, our team decided to launch Scroll for Robotics as the first B2B Middleware-as-a-Service (MaaS) provider, assisting industries across various sectors with industrial robotic automation by designing and developing a custom hub. This hub acts like a bridge, which connects all components in their robotic automation setup architecture to the Scroll ecosystem. The benefit of using a custom middleware hub is that all of the important layers in the Web2-based robotic automation systems such as the factory floor (physical hardwares and robotics), IoT connectivity layer, security layer and also control and management layer, able to interact with the blockchain layer component easily (which involve on-chain **RWA** assets, accounts, smart contract or any on-chain tooling integration). Our hub will now become the common interface for industries to connect all robotic components built by different language, framework, hardware, and communication protocol into a unified Web3 system on Scroll. Below is a high-level architecture overview of a custom hub in a industry robotic setup:

### Introduce the concept of Hub - Architecture Overview

![image](https://github.com/user-attachments/assets/46398ba6-e43b-48fa-bb01-18dc209aa596)

### Why custom, not a “one-size-fits-all” solution❓

Our role is crucial because industrial robotic architectures are often complex and highly customized. Each industry has unique operational needs, diverse technologies, and specific regulatory requirements, making a one-size-fits-all approach impractical. That's why we offer tailored solutions, enabling industries to integrate Scroll Web3 infrastructure efficiently, which aligns perfectly with our product-market fit. This approach not only saves significant time for indsutries but also reduces costs.

![image](https://github.com/user-attachments/assets/c3346aa3-ed69-4a16-8614-0dedd6b3af60)

As a B2B (business-to-business) service provider, we are proud to be the first to offer this service on Scroll. In one of our future milestone (have a look in our pitch deck), Scroll for Robotics will also serve as a key driver in introducing a comprehensive ecosystem of industry-specific robotic development tools to the Scroll community as part of our ongoing service journey.

## How we helps our industry clients? (Not Limited To)

- **🏭 Manufacturing:** Tokenized digital twin robots managing tokenized inventory assets on Scroll. Leaving a transparent production line trail to trace back.

- **🚚 3PL (Third Party Logistics) and Ecommerce:** Tokenized digital twin order fulfilment robots managing tokenized stocks and products on Scroll. Having real-time on-chain updates of your parcel.

- **🧬 Pharmaceutical and Biotech:** Tokenized digital twin robots managing tokenized pharmaceutical products on Scroll. Making drug transparency regulations (e.g FDA) easier to follow.

- **🍄 Agriculture and Farming:** Tokenized digital twin agriculture robots managing tokenized crops and products on Scroll. Greatly enhanced food traceability and source transparency.

## Proof of Concept: An Implementation Prototype

The implementation prototype we showcase in the demo video is built using the hub architecture concept that we proposed, which able to operate a robotic-powered small scale ecommerce-warehouse supply chain cycle. Further proving the feasibility of utilising Scroll solutions to solve real world industry problem in our project. Below attached is a high-level architecture diagram of our ecommerce-warehouse demo setup, which our custom hub being the most crucial middleware component:

![image](https://github.com/user-attachments/assets/91b59c50-bc90-4a60-9cf2-a940549fef7f)

The order placement occurs at the client layer, the purchased inventory are represented as tokenized RWA in the warehouse. Once an order is placed, the on-chain components (order contract and warehouse contract) orchestrate and coordinate the fulfillment process, leveraging tokenized robot assigned to various tasks. These robots are digital twins of real-world machines operating in a factory, simulated to mirror physical processes. 

For our demo, we designed a warehouse operation that includes picking, packing, and delivering. We built a simulation using Webot and embedded it in our demo for seamless interaction with Scroll. When each robot completes a task in the simulation, it logs the action on Scroll, and the warehouse will trigger the next operation. For example, when a client orders a green cube, the picking order is assigned to a picking robot on Scroll, and the picking robot in the simulation will perform the task. After each robot completes its assigned task, it logs the action on Scroll, and the warehouse contract triggers the next packing operation.

One of the key innovation in our demo system is the use of AnyRand, an on-chain randomness mechanism that dynamically selects an available robot from the fleet for each operation, optimizing workload distribution in a process known as load balancing. This architecture demonstrates how a hub can seamlessly integrate Scroll native Web3 services with industrial operations involving tokenized RWA, enabling functionalities such as on-chain recipient verification, attestations for last-mile distribution, and tamper-proof on-chain storage of industry data. Furthermore, in a Human-Robot Collaborative Environment, where human oversight is crucial, a multi-signature mechanism on Scroll able to ensure secure and efficient supervision, creating a real-time feedback loop that directly influences the behavior of the tokenized robots.
