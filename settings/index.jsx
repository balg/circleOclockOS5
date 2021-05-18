import { colors, gradients } from '../common/colors'

function mySettings(props) {
  const colorSet = Object.entries(colors).map(([key, data]) => ({
    color: data.color,
    value: key
  }))
  const gradientSet = Object.entries(gradients).map(([key, data]) => ({
    color: data.color2,
    value: key
  }))
  return (
    <Page>
      <Section title="Color">
        <ColorSelect settingsKey="color" colors={colorSet} />
      </Section>
      <Section title="Gradient">
        <ColorSelect settingsKey="color" colors={gradientSet} />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
