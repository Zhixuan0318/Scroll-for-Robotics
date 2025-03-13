'use client';

import RobotCard from '@/components/RobotCard';

import useActiveRobots from '@/hooks/use-active-robots';

import './twins.css';

export default function Twins() {
    const robots = useActiveRobots();

    return (
        <main className='twins'>
            <section className='robots'>
                {['Picking Robot', 'Packing Robot', 'Delivery Robot'].map((name, index) => (
                    <RobotCard key={name} amount={robots[index]} name={name as any} />
                ))}
            </section>
        </main>
    );
}
