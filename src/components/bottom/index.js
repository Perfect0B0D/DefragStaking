import { ReactComponent as Github } from '../../assets/icons/github.svg';
import { ReactComponent as Telegram } from '../../assets/icons/telegram.svg';
import { ReactComponent as Twitter } from '../../assets/icons/twitter.svg';
import { ReactComponent as Discord } from '../../assets/icons/discord.svg';

import './bottom.css';
function Bottom() {
    return (
        <div>
            <footer>
                <div className="wrapper">
                    <small>&copy;2022 <strong>Awesome Company</strong>, All Rights Reserved</small>
                    <nav className="footer-nav">
                        <a href="#" target='_blank'>
                            <Github />
                        </a>
                        <a href="#" target='_blank'>
                            <Discord />
                        </a>
                        <a href="#" target='_blank'>
                            <Telegram />
                        </a>
                        <a href="#" target='_blank'>
                            <Twitter />
                        </a>
                    </nav>
                </div>
            </footer>
        </div>
    );
}

export default Bottom;
