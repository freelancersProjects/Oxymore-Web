import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Star, Shield, ArrowRight, Check } from 'lucide-react';
import { OXMButton, OXMCheckbox, OXMStepIndicator, OXMCardSelector, OXMInput, OXMTextArea, OXMDropdown } from '@oxymore/ui';
import { teamService } from '../../services/teamService';
import { regionService, type Country } from '../../services/regionService';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../api/apiService';
import type { CardOption } from '@oxymore/ui';
import './CreateTeam.scss';

type Step = 'basic' | 'details' | 'settings' | 'final' | 'success';

export const CreateTeam: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamId, setTeamId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxMembers: 10,
    entryType: 'open' as 'open' | 'inscription' | 'cv',
    isVerified: false,
    region: '',
    id_game: ''
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [gameOptions, setGameOptions] = useState<CardOption[]>([]);
  const [countryOptions, setCountryOptions] = useState<{label: string, value: string}[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const nextStep = () => {
    if (currentStep === 'basic') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('settings');
    } else if (currentStep === 'settings') {
      setCurrentStep('final');
    }
  };

  const prevStep = () => {
    if (currentStep === 'details') {
      setCurrentStep('basic');
    } else if (currentStep === 'settings') {
      setCurrentStep('details');
    } else if (currentStep === 'final') {
      setCurrentStep('settings');
    }
  };

  const handleSubmit = async () => {
    if (!user?.id_user) {
      console.error('Utilisateur non connecté');
      return;
    }

    setIsSubmitting(true);

    try {
      const team = await teamService.createTeam(formData, user.id_user);
      setTeamId(team.id);
      setCurrentStep('success');
    } catch (error) {
      console.error('Erreur lors de la création de l\'équipe:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate('/teams');
  };

  const goToTeam = () => {
    navigate(`/teams/${teamId}`);
  };

  const stepVariants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 }
  };

  const stepTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30
  };

  React.useEffect(() => {
    const loadData = async () => {
      const [countriesData, gamesData] = await Promise.all([
        regionService.getAllCountries(),
        apiService.get('/games')
      ]);

      setCountries(countriesData);
      setGames(gamesData);

      const options: CardOption[] = gamesData.map((game: any) => ({
        id: game.id,
        title: game.name,
        description: game.description
      }));
      setGameOptions(options);

      const countryOpts = countriesData.map(country => ({
        label: `${country.flag} ${country.name}`,
        value: country.code
      }));
      setCountryOptions(countryOpts);
    };

    loadData();
  }, []);

  return (
    <div className="create-team-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="create-team-content"
      >
        <div className="create-team-header">
          <button onClick={handleGoBack} className="back-btn">
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <h1 className="page-title">Créer une Équipe</h1>
        </div>

        <OXMStepIndicator
          steps={[
            { id: 'basic', label: 'Informations' },
            { id: 'details', label: 'Détails' },
            { id: 'settings', label: 'Paramètres' },
            { id: 'final', label: 'Finalisation' }
          ]}
          currentStep={currentStep}
        />

        <AnimatePresence mode="wait">
          {currentStep === 'basic' && (
            <motion.div
              key="basic"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
              className="step-content"
            >
              <div className="step-header">
                <h2 className="step-title">
                  <Users className="w-6 h-6" />
                  Informations de base
                </h2>
                <p className="step-description">
                  Commençons par les informations essentielles de votre équipe
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="name">Nom de l'équipe *</label>
                <OXMInput
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Team Liquid"
                  theme="purple"
                  size="large"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <OXMTextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décrivez votre équipe, ses objectifs, son style de jeu..."
                  rows={4}
                  theme="purple"
                  size="large"
                />
              </div>

              <div className="step-actions">
                <OXMButton
                  variant="primary"
                  onClick={nextStep}
                  disabled={!formData.name}
                >
                  Continuer
                  <ArrowRight className="w-4 h-4" />
                </OXMButton>
              </div>
            </motion.div>
          )}

          {currentStep === 'details' && (
            <motion.div
              key="details"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
              className="step-content"
            >
              <div className="step-header">
                <h2 className="step-title">
                  <Star className="w-6 h-6" />
                  Région et Jeux
                </h2>
                <p className="step-description">
                  Sélectionnez votre région et les jeux sur lesquels vous jouez
                </p>
              </div>

              <div className="form-group">
                <label>Région</label>
                <OXMDropdown
                  options={countryOptions}
                  value={formData.region}
                  onChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      region: value
                    }));
                  }}
                  placeholder="Sélectionnez votre région"
                  theme="purple"
                />
              </div>

              <div className="form-group">
                <label>Jeu</label>
                <OXMCardSelector
                  options={gameOptions}
                  selectedId={formData.id_game}
                  onChange={(selectedId) => {
                    setFormData(prev => ({
                      ...prev,
                      id_game: selectedId
                    }));
                  }}
                  theme="purple"
                  size="medium"
                />
              </div>

              <div className="step-actions">
                <OXMButton
                  variant="secondary"
                  onClick={prevStep}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Précédent
                </OXMButton>
                <OXMButton
                  variant="primary"
                  onClick={nextStep}
                >
                  Continuer
                  <ArrowRight className="w-4 h-4" />
                </OXMButton>
              </div>
            </motion.div>
          )}

          {currentStep === 'settings' && (
            <motion.div
              key="settings"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
              className="step-content"
            >
              <div className="step-header">
                <h2 className="step-title">
                  <Shield className="w-6 h-6" />
                  Paramètres de l'équipe
                </h2>
                <p className="step-description">
                  Configurez les paramètres de recrutement et de vérification
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="maxMembers">Nombre maximum de membres</label>
                <input
                  type="number"
                  id="maxMembers"
                  name="maxMembers"
                  value={formData.maxMembers}
                  onChange={handleInputChange}
                  min="5"
                  max="20"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="entryType">Type d'entrée</label>
                <select
                  id="entryType"
                  name="entryType"
                  value={formData.entryType}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="open">Ouvert (tout le monde peut rejoindre)</option>
                  <option value="inscription">Sur inscription (demande d'adhésion)</option>
                  <option value="cv">Sur CV (sélection rigoureuse)</option>
                </select>
              </div>

              <div className="form-group checkbox-group">
                <OXMCheckbox
                  checked={formData.isVerified}
                  onChange={(checked: boolean) => setFormData(prev => ({ ...prev, isVerified: checked }))}
                  label="Demander la vérification officielle"
                />
                <p className="checkbox-description">
                  Votre équipe sera soumise à un processus de vérification
                </p>
              </div>

              <div className="step-actions">
                <OXMButton
                  variant="secondary"
                  onClick={prevStep}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Précédent
                </OXMButton>
                <OXMButton
                  variant="primary"
                  onClick={nextStep}
                >
                  Continuer
                  <ArrowRight className="w-4 h-4" />
                </OXMButton>
              </div>
            </motion.div>
          )}

          {currentStep === 'final' && (
            <motion.div
              key="final"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
              className="step-content"
            >
              <div className="step-header">
                <h2 className="step-title">
                  <Star className="w-6 h-6" />
                  Finalisation
                </h2>
                <p className="step-description">
                  Vérifiez les informations et créez votre équipe
                </p>
              </div>

              <div className="summary">
                <div className="summary-item">
                  <span className="label">Nom :</span>
                  <span className="value">{formData.name}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Description :</span>
                  <span className="value">{formData.description || 'Aucune description'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Membres max :</span>
                  <span className="value">{formData.maxMembers}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Type d'entrée :</span>
                  <span className="value">
                    {formData.entryType === 'open' ? 'Ouvert' :
                     formData.entryType === 'inscription' ? 'Sur inscription' : 'Sur CV'}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Vérification :</span>
                  <span className="value">{formData.isVerified ? 'Demandée' : 'Non demandée'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Région :</span>
                  <span className="value">
                    {formData.region
                      ? countries.find(c => c.code === formData.region)?.flag + ' ' + countries.find(c => c.code === formData.region)?.name
                      : 'Non spécifiée'}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Jeu :</span>
                  <span className="value">
                    {formData.id_game
                      ? games.find(g => g.id === formData.id_game)?.name || 'Inconnu'
                      : 'Aucun'}
                  </span>
                </div>
              </div>

              <div className="step-actions">
                <OXMButton
                  variant="secondary"
                  onClick={prevStep}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Précédent
                </OXMButton>
                <OXMButton
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Création...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Créer l'équipe
                    </>
                  )}
                </OXMButton>
              </div>
            </motion.div>
          )}

          {currentStep === 'success' && (
            <motion.div
              key="success"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
              className="step-content success-content"
            >
              <div className="success-animation">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="success-icon"
                >
                  <Check className="w-16 h-16" />
                </motion.div>
              </div>

              <div className="step-header">
                <h2 className="step-title success-title">
                  Équipe créée avec succès !
                </h2>
                <p className="step-description">
                  Votre équipe <strong>{formData.name}</strong> a été créée.
                  <br />
                  ID de l'équipe : <code className="team-id">{teamId}</code>
                </p>
              </div>

              <div className="step-actions">
                <OXMButton
                  variant="secondary"
                  onClick={handleGoBack}
                >
                  Retour aux équipes
                </OXMButton>
                <OXMButton
                  variant="primary"
                  onClick={goToTeam}
                >
                  Voir mon équipe
                  <ArrowRight className="w-4 h-4" />
                </OXMButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
