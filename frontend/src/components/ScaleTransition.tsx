import '../styles/ScaleTransition.css';
import { useEffect, useState } from 'react';

interface ScaleTransitionProps {
    src: string;
    active?: boolean;
    position: string;
}

const ScaleTransition: React.FC<ScaleTransitionProps> = ({ src, active = false, position }) => {
    const [mountedActive, setMountedActive] = useState(false);

    useEffect(() => {
        if (active) {
            const timer = setTimeout(() => setMountedActive(true), 50);
            return () => clearTimeout(timer);
        } else {
            setMountedActive(false);
        }
    }, [active]);

    return (
        <div className="slide-image-container" >
            <div
                className={`image-bg ${mountedActive ? 'zoomed' : ''}`}
                style={{ backgroundImage: `url(${src})`, backgroundPosition: position}}
                aria-hidden="true"
            />
        </div>
    )
}

export default ScaleTransition