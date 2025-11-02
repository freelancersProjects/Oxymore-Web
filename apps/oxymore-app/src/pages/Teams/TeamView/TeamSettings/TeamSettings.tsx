import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, LogOut } from 'lucide-react';
import { OXMToast, OXMDropdown } from '@oxymore/ui';
import { teamService } from '../../../../services/teamService';
import { regionService, type Country } from '../../../../services/regionService';
import type { Team, TeamMember } from '../../../../types/team';
import EditableField from './EditableField';
import ImageCropperModal from './ImageCropperModal';
import ImageDropZone from '../../../../components/ImageDropZone/ImageDropZone';
import LeaveTeamModal from '../LeaveTeamModal';
import './TeamSettings.scss';

interface TeamSettingsProps {
  teamId: string;
  teamData: Team | null;
  onTeamUpdate?: (team: Team) => void;
}

const TeamSettings: React.FC<TeamSettingsProps> = ({ teamId, teamData, onTeamUpdate }) => {
  const navigate = useNavigate();
  const [localTeamData, setLocalTeamData] = useState<Team | null>(teamData);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showLeaveTeamModal, setShowLeaveTeamModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [countryOptions, setCountryOptions] = useState<{label: string; value: string}[]>([]);
  const [droppedImageForModal, setDroppedImageForModal] = useState<string | null>(null);

  React.useEffect(() => {
    const userStr = localStorage.getItem("useroxm");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUserId(user.id_user);
    }

    const loadUserRole = async () => {
      if (currentUserId && teamId) {
        try {
          const members = await teamService.getTeamMembersByTeamId(teamId);
          const userMember = members.find((member: TeamMember) => member.id_user === currentUserId);
          if (userMember) {
            setUserRole(userMember.role);
          }
        } catch (error) {
        }
      }
    };

    if (currentUserId) {
      loadUserRole();
    }
  }, [teamId, currentUserId]);

  React.useEffect(() => {
    setLocalTeamData(teamData);
  }, [teamData]);

  React.useEffect(() => {
    const loadCountries = async () => {
      const all = await regionService.getAllCountries();
      setCountries(all);
      setCountryOptions(all.map(c => ({ label: `${c.flag} ${c.name}` , value: c.code })));
    };
    loadCountries();
  }, []);

  const handleFieldUpdate = async (field: keyof Team, value: string | number) => {
    if (!localTeamData) return;

    const isCreatorCheck = localTeamData.id_captain === currentUserId;
    if (!isCreatorCheck) {
      setToast({ message: 'Vous n\'avez pas la permission de modifier cette équipe', type: 'error' });
      return;
    }

    try {
      const updateData: Partial<Team> = { [field]: value };
      const updatedTeam = await teamService.updateTeam(teamId, updateData);
      setLocalTeamData(updatedTeam);
      if (onTeamUpdate) {
        onTeamUpdate(updatedTeam);
      }
      setToast({ message: 'Paramètres mis à jour avec succès', type: 'success' });
    } catch (error) {
      setToast({ message: 'Erreur lors de la mise à jour', type: 'error' });
      throw error;
    }
  };

  const handleImageUpdate = async (imageData: string, type: 'logo' | 'banner') => {
    if (!localTeamData) return;

    const isCreator = localTeamData.id_captain === currentUserId;
    if (!isCreator) {
      setToast({ message: 'Vous n\'avez pas la permission de modifier cette équipe', type: 'error' });
      return;
    }

    try {
      const updateData: Partial<Team> = { [type]: imageData };
      const updatedTeam = await teamService.updateTeam(teamId, updateData);
      setLocalTeamData(updatedTeam);
      if (onTeamUpdate) {
        onTeamUpdate(updatedTeam);
      }
      setToast({ message: `${type === 'logo' ? 'Logo' : 'Bannière'} mis à jour avec succès`, type: 'success' });
    } catch (error) {
      setToast({ message: 'Erreur lors de la mise à jour de l\'image', type: 'error' });
    }
  };

  const handleLogoSave = (imageData: string, _position: { x: number; y: number; scale: number }) => {
    handleImageUpdate(imageData, 'logo');
  };

  const handleBannerSave = (imageData: string, _position: { x: number; y: number; scale: number }) => {
    handleImageUpdate(imageData, 'banner');
  };

  const handleLogoDrop = (imageData: string) => {
    setDroppedImageForModal(imageData);
    setShowLogoModal(true);
  };

  const handleBannerDrop = (imageData: string) => {
    setDroppedImageForModal(imageData);
    setShowBannerModal(true);
  };

  // const getEntryTypeLabel = (type: string) => {
  //   const labels: Record<string, string> = {
  //     open: 'Ouverte',
  //     inscription: 'Sur inscription',
  //     cv: 'Sur CV'
  //   };
  //   return labels[type] || type;
  // };

  const isCreator = localTeamData?.id_captain === currentUserId;

  const handleEntryTypeChange = async (newValue: string) => {
    if (!isCreator) return;
    if (!['open', 'inscription', 'cv'].includes(newValue)) return;
    await handleFieldUpdate('entryType', newValue as 'open' | 'inscription' | 'cv');
  };

  const getCurrentRegionCode = (): string => {
    if (!localTeamData?.region || countries.length === 0) return '';

    // Recherche exacte par nom
    let country = countries.find(c =>
      c.name.toLowerCase() === localTeamData.region?.toLowerCase()
    );

    // Si pas trouvé, recherche partielle
    if (!country) {
      country = countries.find(c =>
        localTeamData.region?.toLowerCase().includes(c.name.toLowerCase()) ||
        c.name.toLowerCase().includes(localTeamData.region?.toLowerCase() || '')
      );
    }

    return country?.code || '';
  };

  const handleRegionChange = async (code: string) => {
    if (!isCreator || !localTeamData || !code) return;
    try {
      const country = countries.find(c => c.code === code);
      if (!country) {
        setToast({ message: 'Pays non trouvé', type: 'error' });
        return;
      }
      await handleFieldUpdate('region', country.name);
    } catch (error) {
      setToast({ message: 'Erreur lors de la mise à jour de la région', type: 'error' });
    }
  };

  if (!localTeamData) {
    return (
      <div className="team-settings-page">
        <div className="team-settings-loading">
          <p>Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="team-settings-page">
      <div className="team-settings-header">
        <h2 className="team-settings-title">Paramètres de l'équipe</h2>
        <p className="team-settings-subtitle">Gérez les informations de votre équipe</p>
      </div>

      <div className="team-settings-content">
        <div className="team-settings-section">
          <h3 className="section-title">Apparence</h3>
          <div className="settings-fields">
            <div className="image-field">
              <div className="image-field__label">Logo de l'équipe</div>
              <div className="image-field__content">
                <ImageDropZone
                  onImageDrop={handleLogoDrop}
                  disabled={!isCreator}
                  type="logo"
                  className={`image-preview image-preview--logo ${!isCreator ? 'disabled' : ''}`}
                >
                <div
                  onClick={() => isCreator && setShowLogoModal(true)}
                  style={{ cursor: isCreator ? 'pointer' : 'not-allowed', opacity: isCreator ? 1 : 0.6, width: '100%', height: '100%' }}
                >
                  {localTeamData.logo ? (
                    <img
                      src={localTeamData.logo}
                      alt="Logo de l'équipe"
                      className="image-preview__img"
                    />
                  ) : (
                    <div className="image-preview__placeholder">
                      <ImageIcon size={32} />
                      <span>Cliquez pour ajouter un logo</span>
                    </div>
                  )}
                  <div className="image-preview__overlay">
                    <ImageIcon size={20} />
                    <span>Modifier</span>
                  </div>
                </div>
                </ImageDropZone>
              </div>
            </div>

            <div className="image-field">
              <div className="image-field__label">Bannière de l'équipe</div>
              <div className="image-field__content">
                <ImageDropZone
                  onImageDrop={handleBannerDrop}
                  disabled={!isCreator}
                  type="banner"
                  className={`image-preview image-preview--banner ${!isCreator ? 'disabled' : ''}`}
                >
                <div
                  onClick={() => isCreator && setShowBannerModal(true)}
                  style={{ cursor: isCreator ? 'pointer' : 'not-allowed', opacity: isCreator ? 1 : 0.6, width: '100%', height: '100%' }}
                >
                  {localTeamData.banner ? (
                    <img
                      src={localTeamData.banner}
                      alt="Bannière de l'équipe"
                      className="image-preview__img"
                    />
                  ) : (
                    <div className="image-preview__placeholder">
                      <ImageIcon size={32} />
                      <span>Cliquez pour ajouter une bannière</span>
                    </div>
                  )}
                  <div className="image-preview__overlay">
                    <ImageIcon size={20} />
                    <span>Modifier</span>
                  </div>
                </div>
                </ImageDropZone>
              </div>
            </div>
          </div>
        </div>

        <div className="team-settings-section">
          <h3 className="section-title">Informations générales</h3>
          <div className="settings-fields">
            <EditableField
              label="Nom de l'équipe"
              value={localTeamData.name}
              onSave={(value) => handleFieldUpdate('name', value)}
              placeholder="Nom de l'équipe"
              maxLength={50}
              disabled={!isCreator}
            />

            <EditableField
              label="Description"
              value={localTeamData.description}
              onSave={(value) => handleFieldUpdate('description', value)}
              type="textarea"
              placeholder="Description de l'équipe"
              maxLength={500}
              disabled={!isCreator}
            />

            <div className="editable-field">
              <div className="editable-field__label">Région</div>
              <div className="editable-field__content" style={{ width: '100%' }}>
                <div className="editable-field__value-wrapper" style={{ width: '100%' }}>
                  <div style={{ width: '100%', opacity: isCreator ? 1 : 0.6, pointerEvents: isCreator ? 'auto' : 'none' }}>
                    {/* @ts-ignore */}
                    <OXMDropdown
                      options={countryOptions}
                      value={getCurrentRegionCode()}
                      onChange={(value) => handleRegionChange(String(value))}
                      placeholder="Sélectionner un pays"
                      theme="purple"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="team-settings-section">
          <h3 className="section-title">Configuration</h3>
          <div className="settings-fields">
            <EditableField
              label="Nombre maximum de membres"
              value={localTeamData.maxMembers.toString()}
              onSave={(value) => handleFieldUpdate('maxMembers', parseInt(value, 10) || 10)}
              type="number"
              placeholder="10"
              disabled={!isCreator}
            />

            <div className="editable-field">
              <div className="editable-field__label">Type d'accès</div>
              <div className="editable-field__content">
                <div className="entry-type-selector">
                  <button
                    className={`entry-type-btn ${localTeamData.entryType === 'open' ? 'active' : ''}`}
                    onClick={() => handleEntryTypeChange('open')}
                    disabled={!isCreator}
                  >
                    Ouverte
                  </button>
                  <button
                    className={`entry-type-btn ${localTeamData.entryType === 'inscription' ? 'active' : ''}`}
                    onClick={() => handleEntryTypeChange('inscription')}
                    disabled={!isCreator}
                  >
                    Sur inscription
                  </button>
                  <button
                    className={`entry-type-btn ${localTeamData.entryType === 'cv' ? 'active' : ''}`}
                    onClick={() => handleEntryTypeChange('cv')}
                    disabled={!isCreator}
                  >
                    Sur CV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="team-settings-section">
          <h3 className="section-title">Informations en lecture seule</h3>
          <div className="settings-fields">
            <div className="readonly-field">
              <div className="editable-field__label">Capitaine</div>
              <div className="editable-field__value">{localTeamData.captain}</div>
            </div>

            <div className="readonly-field">
              <div className="editable-field__label">Date de création</div>
              <div className="editable-field__value">
                {new Date(localTeamData.foundedDate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>

            <div className="readonly-field">
              <div className="editable-field__label">Membres actuels</div>
              <div className="editable-field__value">
                {localTeamData.members} / {localTeamData.maxMembers}
              </div>
            </div>
          </div>
        </div>

        <div className="team-settings-section team-settings-section--danger">
          <h3 className="section-title section-title--danger">Zone de danger</h3>
          <div className="settings-fields">
            <div className="danger-field">
              <div className="danger-field__content">
                <div className="danger-field__info">
                  <div className="danger-field__label">Quitter l'équipe</div>
                  <div className="danger-field__description">
                    Une fois que vous quittez l'équipe, vous perdrez l'accès à tous les messages, défis et statistiques de l'équipe.
                  </div>
                </div>
                <button
                  className="danger-field__button"
                  onClick={() => setShowLeaveTeamModal(true)}
                >
                  <LogOut size={18} />
                  Quitter l'équipe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImageCropperModal
        isOpen={showLogoModal}
        onClose={() => {
          setShowLogoModal(false);
          setDroppedImageForModal(null);
        }}
        onSave={handleLogoSave}
        currentImage={droppedImageForModal || localTeamData.logo}
        type="logo"
        title="Modifier le logo"
      />

      <ImageCropperModal
        isOpen={showBannerModal}
        onClose={() => {
          setShowBannerModal(false);
          setDroppedImageForModal(null);
        }}
        onSave={handleBannerSave}
        currentImage={droppedImageForModal || localTeamData.banner}
        type="banner"
        title="Modifier la bannière"
      />

      {toast && (
        /* @ts-ignore */
        <OXMToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {localTeamData && currentUserId && (
        <LeaveTeamModal
          isOpen={showLeaveTeamModal}
          onClose={() => setShowLeaveTeamModal(false)}
          onConfirm={async () => {
            await teamService.leaveTeam(teamId, currentUserId);
            setToast({ message: "Vous avez quitté l'équipe", type: "success" });
            navigate('/teams');
          }}
          teamName={localTeamData.name}
          isCapturing={userRole === 'captain'}
        />
      )}
    </div>
  );
};

export default TeamSettings;
