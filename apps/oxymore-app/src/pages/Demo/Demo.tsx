import { 
  OXMInput, 
  OXMTextArea, 
  OXMCheckbox, 
  OXMCountdown,
  OXMButton,
  OXMSwitch,
  OXMCardSelector,
  OXMCodeInput
} from '@oxymore/ui';
import { useState } from 'react';
import './Demo.scss';

const Demo = () => {
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [checkboxChecked2, setCheckboxChecked2] = useState(true);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [switchChecked2, setSwitchChecked2] = useState(true);
  const [selectedCard, setSelectedCard] = useState('');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [codeValue, setCodeValue] = useState('');

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 2);
  targetDate.setHours(targetDate.getHours() + 5);
  targetDate.setMinutes(targetDate.getMinutes() + 30);

  const cardOptions = [
    {
      id: 'option1',
      title: 'Option 1',
      description: 'Description de l\'option 1',
      icon: '🎮'
    },
    {
      id: 'option2',
      title: 'Option 2',
      description: 'Description de l\'option 2',
      icon: '⚡'
    },
    {
      id: 'option3',
      title: 'Option 3',
      description: 'Description de l\'option 3',
      icon: '🏆'
    }
  ];

  return (
    <div className="demo-page">
      <div className="demo-container">
        <h1>OXM UI Components Demo</h1>
        
        <div className="demo-section">
          <h2>Input Components</h2>
          <div className="demo-row">
            <OXMInput
              placeholder="Input violet (défaut)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              theme="purple"
              className="demo-input"
            />
            <OXMInput
              placeholder="Input bleu"
              theme="blue"
              className="demo-input"
            />
            <OXMInput
              placeholder="Input avec erreur"
              theme="purple"
              error={true}
              errorMessage="Ce champ est requis"
              className="demo-input"
            />
          </div>
        </div>

        <div className="demo-section">
          <h2>TextArea Components</h2>
          <div className="demo-row">
            <OXMTextArea
              placeholder="TextArea violet (défaut)"
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              theme="purple"
              rows={4}
              className="demo-textarea"
            />
            <OXMTextArea
              placeholder="TextArea bleu"
              theme="blue"
              rows={3}
              className="demo-textarea"
            />
          </div>
        </div>

        <div className="demo-section">
          <h2>Checkbox Components</h2>
          <div className="demo-row">
            <OXMCheckbox
              label="Checkbox violet non cochée"
              checked={checkboxChecked}
              onChange={(e) => setCheckboxChecked(e.target.checked)}
              theme="purple"
            />
            <OXMCheckbox
              label="Checkbox violet cochée"
              checked={checkboxChecked2}
              onChange={(e) => setCheckboxChecked2(e.target.checked)}
              theme="purple"
            />
            <OXMCheckbox
              label="Checkbox bleu"
              theme="blue"
            />
            <OXMCheckbox
              label="Checkbox avec erreur"
              theme="purple"
              error={true}
              errorMessage="Veuillez accepter les conditions"
            />
          </div>
        </div>

        <div className="demo-section">
          <h2>Switch Components</h2>
          <div className="demo-row">
            <OXMSwitch
              label="Switch violet non activé"
              checked={switchChecked}
              onChange={(e) => setSwitchChecked(e.target.checked)}
              theme="purple"
            />
            <OXMSwitch
              label="Switch violet activé"
              checked={switchChecked2}
              onChange={(e) => setSwitchChecked2(e.target.checked)}
              theme="purple"
            />
            <OXMSwitch
              label="Switch bleu"
              theme="blue"
            />
            <OXMSwitch
              label="Switch avec erreur"
              theme="purple"
              error={true}
              errorMessage="Veuillez activer cette option"
            />
          </div>
        </div>

        <div className="demo-section">
          <h2>CardSelector Components</h2>
          <div className="demo-row">
            <OXMCardSelector
              options={cardOptions}
              selectedId={selectedCard}
              onChange={setSelectedCard}
              theme="purple"
              className="demo-card-selector"
            />
            <OXMCardSelector
              options={cardOptions}
              selectedIds={selectedCards}
              onMultipleChange={setSelectedCards}
              multiple={true}
              theme="blue"
              className="demo-card-selector"
            />
          </div>
        </div>

        <div className="demo-section">
          <h2>CodeInput Components</h2>
          <div className="demo-row">
            <OXMCodeInput
              length={6}
              value={codeValue}
              onChange={setCodeValue}
              onComplete={(code) => console.log('Code complet:', code)}
              theme="purple"
              className="demo-code-input"
            />
            <OXMCodeInput
              length={4}
              theme="blue"
              type="text"
              placeholder="*"
              className="demo-code-input"
            />
          </div>
        </div>

        <div className="demo-section">
          <h2>Countdown Components</h2>
          <div className="demo-row">
            <OXMCountdown
              targetDate={targetDate}
              theme="purple"
              size="medium"
              showLabels={true}
            />
            <OXMCountdown
              targetDate={new Date(Date.now() + 3600000)}
              theme="blue"
              size="small"
              showLabels={true}
            />
          </div>
        </div>

        <div className="demo-section">
          <h2>Button Components</h2>
          <div className="demo-row">
            <OXMButton variant="primary" size="medium">
              Button Primary
            </OXMButton>
            <OXMButton variant="secondary" size="medium">
              Button Secondary
            </OXMButton>
            <OXMButton variant="primary" size="small">
              Small Button
            </OXMButton>
            <OXMButton variant="primary" size="large">
              Large Button
            </OXMButton>
          </div>
        </div>

        <div className="demo-section">
          <h2>Différentes Tailles</h2>
          <div className="demo-row">
            <OXMInput
              placeholder="Input small"
              size="small"
              theme="purple"
              className="demo-input"
            />
            <OXMInput
              placeholder="Input medium (défaut)"
              size="medium"
              theme="purple"
              className="demo-input"
            />
            <OXMInput
              placeholder="Input large"
              size="large"
              theme="purple"
              className="demo-input"
            />
          </div>
          <div className="demo-row">
            <OXMCheckbox
              label="Checkbox small"
              size="small"
              theme="purple"
            />
            <OXMCheckbox
              label="Checkbox medium (défaut)"
              size="medium"
              theme="purple"
            />
            <OXMCheckbox
              label="Checkbox large"
              size="large"
              theme="purple"
            />
          </div>
          <div className="demo-row">
            <OXMSwitch
              label="Switch small"
              size="small"
              theme="purple"
            />
            <OXMSwitch
              label="Switch medium (défaut)"
              size="medium"
              theme="purple"
            />
            <OXMSwitch
              label="Switch large"
              size="large"
              theme="purple"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo; 